/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { BigNumber } from '@ethersproject/bignumber';
import { QRLTypedData } from '@theqrl/web3-types';
import { hexToBytes, isNullish, keccak256 } from '@theqrl/web3-utils';
import { isBytes, isQRLTypedDataTypeDefinitions } from '@theqrl/web3-validator';

import ethersAbiCoder from './ethers_abi_coder.js';

const ARRAY_REGEX = /^(.*)\[([0-9]*?)]$/;
const INTEGER_REGEX = /^(u?int)([0-9]*)$/;
const FIXED_BYTES_REGEX = /^bytes([0-9]+)$/;
const QRL_HEX_INTEGER_REGEX = /^0[xX][0-9a-fA-F]+$/;
const QRL_DECIMAL_INTEGER_REGEX = /^[+-]?[0-9]+$/;
const QRL_ADDRESS_REGEX = /^Q[0-9a-fA-F]{128}$/;
const QRL_WORD_BITS = 512;
const GO_INT64_MIN = BigInt('-9223372036854775808');
const GO_INT64_MAX = BigInt('9223372036854775807');

const getDomainData = (domain: QRLTypedData['domain']): Record<string, unknown> => {
	if (isNullish(domain) || typeof domain !== 'object' || Array.isArray(domain)) {
		throw new Error('Cannot encode data: domain is undefined');
	}

	const result: Record<string, unknown> = {};
	const { name, version, chainId, verifyingContract, salt } = domain as Record<string, unknown>;
	for (const [field, value] of Object.entries({ name, version, verifyingContract, salt })) {
		if (!isNullish(value) && typeof value !== 'string') {
			throw new Error(`Cannot encode data: domain field '${field}' must be a string`);
		}
	}

	if (!isNullish(chainId)) {
		// eslint-disable-next-line no-use-before-define
		result.chainId = parseQRLInteger(chainId, 'domain', 'chainId', 256);
	}
	if (typeof name === 'string' && name.length > 0) result.name = name;
	if (typeof version === 'string' && version.length > 0) result.version = version;
	if (typeof verifyingContract === 'string' && verifyingContract.length > 0) {
		result.verifyingContract = verifyingContract;
	}
	if (typeof salt === 'string' && salt.length > 0) result.salt = salt;

	if (Object.keys(result).length === 0) {
		throw new Error('Cannot encode data: domain is undefined');
	}
	return result;
};

const parseQRLInteger = (
	data: unknown,
	kind: 'type' | 'domain',
	name: string,
	bitWidth: number,
): BigNumber => {
	const valueLabel = kind === 'type' ? `type '${name}'` : `domain field '${name}'`;
	const integerLabel = kind === 'type' ? `'${name}'` : valueLabel;
	let normalized: unknown = data;
	if (typeof data === 'string') {
		if (data === '') {
			normalized = 0;
		} else if (QRL_HEX_INTEGER_REGEX.test(data)) {
			normalized = `0x${data.slice(2)}`;
		} else if (QRL_DECIMAL_INTEGER_REGEX.test(data)) {
			normalized = data.startsWith('+') ? data.slice(1) : data;
		} else {
			throw new Error(`Cannot encode data: value does not match ${valueLabel}`);
		}
	} else if (typeof data === 'number') {
		if (!Number.isInteger(data)) {
			throw new Error(`Cannot encode data: value does not match ${valueLabel}`);
		}
		if (kind === 'domain') {
			const serialized = String(data);
			if (!QRL_DECIMAL_INTEGER_REGEX.test(serialized)) {
				throw new Error(`Cannot encode data: value does not match ${valueLabel}`);
			}
			normalized = serialized;
		} else {
			const integer = BigInt(data);
			if (integer < GO_INT64_MIN || integer > GO_INT64_MAX) {
				throw new Error(`Cannot encode data: value does not match ${valueLabel}`);
			}
			normalized = integer.toString();
		}
	} else if (typeof data === 'bigint') {
		normalized = data.toString();
	} else if (!BigNumber.isBigNumber(data)) {
		throw new Error(`Cannot encode data: value does not match ${valueLabel}`);
	}

	let value: BigNumber;
	try {
		value = BigNumber.from(normalized);
	} catch {
		throw new Error(`Cannot encode data: value does not match ${valueLabel}`);
	}

	const maxMagnitude = BigNumber.from(2).pow(bitWidth).sub(1);
	if (value.abs().gt(maxMagnitude)) {
		throw new Error(`Cannot encode data: integer larger than ${integerLabel}`);
	}
	return value;
};

const encodeInteger = (type: string, data: unknown): [string, BigNumber] | undefined => {
	const match = type.match(INTEGER_REGEX);
	if (!match) return undefined;

	const signed = match[1] === 'int';
	const bitWidth = match[2] === '' ? QRL_WORD_BITS : Number(match[2]);
	if (bitWidth < 8 || bitWidth > QRL_WORD_BITS || bitWidth % 8 !== 0) {
		throw new Error(`Cannot encode data: invalid integer type '${type}'`);
	}

	const value = parseQRLInteger(data, 'type', type, bitWidth);
	if (!signed && value.isNegative()) {
		throw new Error(`Cannot encode data: invalid negative value for unsigned type '${type}'`);
	}

	return ['uint512', value.isNegative() ? value.toTwos(QRL_WORD_BITS) : value];
};

/**
 * Get the dependencies of a struct type. If a struct has the same dependency multiple times, it's only included once
 * in the resulting array.
 */
const getDependencies = (
	typedData: QRLTypedData,
	type: string,
	dependencies: string[] = [],
): string[] => {
	const actualType = type.endsWith('[]') ? type.slice(0, -2) : type;
	if (dependencies.includes(actualType)) {
		return dependencies;
	}

	if (!typedData.types[actualType]) {
		return dependencies;
	}

	let found = [...dependencies, actualType];
	for (const field of typedData.types[actualType]) {
		found = getDependencies(typedData, field.type, found);
	}
	return found;
};

/**
 * Encode a type to a string. All dependant types are alphabetically sorted.
 *
 */
const encodeType = (typedData: QRLTypedData, type: string): string => {
	const dependencies = getDependencies(typedData, type);
	const types = dependencies.length === 0 ? [] : [type, ...dependencies.slice(1).sort()];

	return types
		.map(
			dependency =>
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`${dependency}(${typedData.types[dependency].map(
					_type => `${_type.type} ${_type.name}`,
				)})`,
		)
		.join('');
};

/**
 * Get a type string as hash.
 */
const getTypeHash = (typedData: QRLTypedData, type: string) =>
	keccak256(encodeType(typedData, type));

/**
 * Get encoded data as a hash. The data should be a key-to-value object with all the required values. All dependant
 * types are automatically encoded.
 */
const getStructHash = (
	typedData: QRLTypedData,
	type: string,
	data: Record<string, unknown>,
	// eslint-disable-next-line  no-use-before-define
): string => keccak256(encodeData(typedData, type, data));

/**
 * Get the EIP-191 encoded QRL typed-data message to sign. If `hash` is enabled, the message is
 * hashed with Keccak-256.
 */
export const getQRLTypedDataMessage = (typedData: QRLTypedData, hash?: boolean): string => {
	const EIP_191_PREFIX = '1901';
	if (!isQRLTypedDataTypeDefinitions(typedData?.types)) {
		throw new Error('Cannot encode data: invalid type definitions');
	}
	const domainData = getDomainData(typedData.domain);
	const message = `0x${EIP_191_PREFIX}${getStructHash(
		typedData,
		'QRLTypedDataDomain',
		domainData,
	).substring(2)}${getStructHash(typedData, typedData.primaryType, typedData.message).substring(
		2,
	)}`;

	if (hash) {
		return keccak256(message);
	}

	return message;
};

/**
 * Encodes a single value to an ABI serialisable string, number or Buffer. Returns the data as tuple, which consists of
 * an array of ABI compatible types, and an array of corresponding values.
 */
const encodeValue = (typedData: QRLTypedData, type: string, data: unknown): [string, unknown] => {
	const match = type.match(ARRAY_REGEX);

	// Checks for array types
	if (match) {
		const arrayType = match[1];
		if (match[2] !== '' || ARRAY_REGEX.test(arrayType)) {
			throw new Error(`Cannot encode data: unsupported array type '${type}'`);
		}

		if (!Array.isArray(data)) {
			throw new Error('Cannot encode data: value is not of array type');
		}

		const encodedData = data.map(item => encodeValue(typedData, arrayType, item));
		const types = encodedData.map(item => item[0]);
		const values = encodedData.map(item => item[1]);

		return ['bytes32', keccak256(ethersAbiCoder.encode(types, values))];
	}

	if (typedData.types[type]) {
		return ['bytes32', getStructHash(typedData, type, data as Record<string, unknown>)];
	}

	// QRL strings are always literal UTF-8, including values with a 0x prefix.
	if (type === 'string') {
		if (typeof data !== 'string') {
			throw new Error("Cannot encode data: value does not match type 'string'");
		}
		return ['bytes32', keccak256(new TextEncoder().encode(data))];
	}

	if (type === 'bytes') {
		if (!isBytes(data as string | Uint8Array | number[])) {
			throw new Error("Cannot encode data: value does not match type 'bytes'");
		}
		return ['bytes32', keccak256(data as string | Uint8Array | number[])];
	}

	if (FIXED_BYTES_REGEX.test(type)) {
		if (!isBytes(data as string | Uint8Array | number[], { abiType: type })) {
			throw new Error(`Cannot encode data: value does not match type '${type}'`);
		}
		return [type, typeof data === 'string' ? hexToBytes(data) : data];
	}

	if (type === 'address') {
		if (typeof data !== 'string' || !QRL_ADDRESS_REGEX.test(data)) {
			throw new Error("Cannot encode data: value does not match type 'address'");
		}
		return ['bytes64', `0x${data.slice(1)}`];
	}

	if (type === 'bool') {
		if (typeof data !== 'boolean') {
			throw new Error("Cannot encode data: value does not match type 'bool'");
		}
		return ['bool', data];
	}

	const integer = encodeInteger(type, data);
	if (integer) return integer;

	return [type, data as string];
};

/**
 * Encode the data to an ABI encoded Buffer. The data should be a key-to-value object with all the required values. All
 * dependant types are automatically encoded.
 */
const encodeData = (
	typedData: QRLTypedData,
	type: string,
	data: Record<string, unknown>,
): string => {
	const fields = typedData.types[type];
	if (!Array.isArray(fields)) {
		throw new Error(`Cannot encode data: type '${type}' is not defined`);
	}
	if (Object.keys(data).length > fields.length) {
		throw new Error(
			`Cannot encode data: extra data provided (${String(fields.length)} < ${String(Object.keys(data).length)})`,
		);
	}

	const [types, values] = fields.reduce<[string[], unknown[]]>(
		([_types, _values], field) => {
			if (isNullish(data[field.name])) {
				throw new Error(`Cannot encode data: missing data for '${field.name}'`);
			}

			const value = data[field.name];
			const [_type, encodedValue] = encodeValue(typedData, field.type, value);

			return [
				[..._types, _type],
				[..._values, encodedValue],
			];
		},
		[['bytes32'], [getTypeHash(typedData, type)]],
	);

	return ethersAbiCoder.encode(types, values);
};
