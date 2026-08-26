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

import { QRLTypedData } from '@theqrl/web3-types';
import { isNullish } from './object.js';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
	!isNullish(value) && typeof value === 'object' && !Array.isArray(value);

const QRL_REFERENCE_TYPE_REGEX = /^[A-Za-z]\w*(\[\])?$/;
const QRL_INTEGER_TYPE_REGEX = /^(u?int)([0-9]+)$/;
const QRL_BYTES_TYPE_REGEX = /^bytes([0-9]+)$/;
const QRL_HEX_INTEGER_REGEX = /^0[xX][0-9a-fA-F]+$/;
const QRL_DECIMAL_INTEGER_REGEX = /^[+-]?[0-9]+$/;
const QRL_PRIMITIVE_TYPES = ['address', 'bool', 'string', 'bytes', 'int', 'uint'];

const stripOneArraySuffix = (type: string): string =>
	type.endsWith('[]') ? type.slice(0, -2) : type;

const isQRLPrimitiveType = (type: string): boolean => {
	const baseType = stripOneArraySuffix(type);
	if (QRL_PRIMITIVE_TYPES.includes(baseType)) return true;

	const integer = baseType.match(QRL_INTEGER_TYPE_REGEX);
	if (integer) {
		const width = Number(integer[2]);
		return String(width) === integer[2] && width >= 8 && width <= 512 && width % 8 === 0;
	}

	const bytes = baseType.match(QRL_BYTES_TYPE_REGEX);
	if (bytes) {
		const width = Number(bytes[1]);
		return String(width) === bytes[1] && width >= 1 && width <= 64;
	}

	return false;
};

/** Checks all declared types against the current go-qrl typed-data grammar. */
export const isQRLTypedDataTypeDefinitions = (value: unknown): boolean => {
	if (!isPlainObject(value)) return false;

	const types = value as Record<string, unknown>;
	for (const [typeKey, members] of Object.entries(types)) {
		if (typeKey.length === 0 || !Array.isArray(members)) return false;

		for (const member of members) {
			if (!isPlainObject(member)) return false;
			if (typeof member.type !== 'string' || member.type.length === 0) return false;
			if (typeof member.name !== 'string' || member.name.length === 0) return false;
			if (typeKey === member.type) return false;
			if (isQRLPrimitiveType(member.type)) continue;

			const referenceType = stripOneArraySuffix(member.type);
			if (!Object.prototype.hasOwnProperty.call(types, referenceType)) return false;
			if (!QRL_REFERENCE_TYPE_REGEX.test(member.type)) return false;
		}
	}

	return true;
};

const isQRLIntegerLiteral = (value: unknown, bits: number): boolean => {
	let parsed: bigint;
	try {
		if (typeof value === 'bigint') {
			parsed = value;
		} else if (typeof value === 'number' && Number.isInteger(value)) {
			const serialized = String(value);
			if (!QRL_DECIMAL_INTEGER_REGEX.test(serialized)) return false;
			parsed = BigInt(serialized);
		} else if (typeof value === 'string') {
			if (value === '') return true;
			if (QRL_HEX_INTEGER_REGEX.test(value)) {
				parsed = BigInt(`0x${value.slice(2)}`);
			} else if (QRL_DECIMAL_INTEGER_REGEX.test(value)) {
				parsed = BigInt(value);
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch {
		return false;
	}

	const zero = BigInt(0);
	const magnitude = parsed < zero ? -parsed : parsed;
	return magnitude < BigInt(1) << BigInt(bits);
};

/**
 * Checks that a value satisfies the structural contract required to encode QRL Typed Structured
 * Data v1.
 *
 * The contract mirrors `getEncodedQRLTypedData` (`@theqrl/web3-qrl-abi`) and the current go-qrl
 * typed-data grammar. Typed-data signing is answered by a wallet provider, which encodes with that
 * same function, so these are the preconditions that must hold before a request is worth sending.
 *
 * Each check below corresponds to a value the encoder dereferences unconditionally; without them
 * a malformed request fails deep inside the encoder with an opaque `TypeError` (for example
 * "Cannot read properties of undefined (reading 'reduce')") instead of a typed validation error.
 *
 * Field-level data (that every member declared in a type is present in `domain`/`message`) is
 * deliberately NOT checked here: the encoder already reports that precisely
 * ("Cannot encode data: missing data for 'x'"), and duplicating it would mean re-implementing
 * type resolution.
 */
export const isQRLTypedData = (value: unknown): boolean => {
	if (!isPlainObject(value)) return false;

	const { types, primaryType, domain, message } = value as Partial<QRLTypedData>;

	// `types` is indexed for every type encountered, and `types.QRLTypedDataDomain` is read
	// unconditionally by `getMessage` to build the domain separator.
	if (!isQRLTypedDataTypeDefinitions(types)) return false;
	if (!Array.isArray((types as Record<string, unknown>).QRLTypedDataDomain)) return false;

	// `primaryType` must name a declared type: `encodeData` does `types[primaryType].reduce(...)`.
	if (typeof primaryType !== 'string' || primaryType.length === 0) return false;
	if (!Array.isArray((types as Record<string, unknown>)[primaryType])) return false;

	// Both are indexed per declared member by `encodeData`.
	if (!isPlainObject(domain)) return false;
	if (!isPlainObject(message)) return false;

	const { name, version, chainId, verifyingContract, salt } = domain;
	if (
		[name, version, verifyingContract, salt].some(
			domainValue => !isNullish(domainValue) && typeof domainValue !== 'string',
		)
	) {
		return false;
	}
	if (!isNullish(chainId) && !isQRLIntegerLiteral(chainId, 256)) return false;

	const hasDomainValue =
		!isNullish(chainId) ||
		[name, version, verifyingContract, salt].some(
			domainValue => typeof domainValue === 'string' && domainValue.length > 0,
		);
	if (!hasDomainValue) return false;

	if (Object.keys(message).length > (types as Record<string, unknown[]>)[primaryType].length) {
		return false;
	}

	return true;
};

/** @deprecated Use {@link isQRLTypedData}. */
export const isEip712TypedData = isQRLTypedData;
