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

import { getEncodedEip712Data, getEncodedQRLTypedData } from '../../src/index';

const goQRLWideValuesGolden: QRLTypedData = {
	types: {
		QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
		WideValues: [
			{ name: 'amount', type: 'uint512' },
			{ name: 'payload', type: 'bytes64' },
		],
	},
	primaryType: 'WideValues',
	domain: { name: 'QRL VM64 Golden' },
	message: {
		amount: `0x${'fedcba9876543210'.repeat(8)}`,
		payload: `0x${'0123456789abcdef'.repeat(8)}`,
	},
};

const goQRLHexPrefixedStringGolden: QRLTypedData = {
	types: {
		QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
		Note: [{ name: 'text', type: 'string' }],
	},
	primaryType: 'Note',
	domain: { name: 'QRL' },
	message: { text: '0x1234' },
};

const typedValue = (type: string, value: unknown): QRLTypedData => ({
	types: {
		QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
		Value: [{ name: 'value', type }],
	},
	primaryType: 'Value',
	domain: { name: 'QRL matrix' },
	message: { value },
});

const domainValue = (
	domainType: string,
	domain: Record<string, string | number>,
): QRLTypedData => ({
	types: {
		QRLTypedDataDomain: [{ name: 'chainId', type: domainType }],
		Value: [],
	},
	primaryType: 'Value',
	domain,
	message: {},
});

describe('go-qrl QRL typed-data compatibility', () => {
	it('matches the go-qrl uint512 and bytes64 golden preimage', () => {
		expect(getEncodedQRLTypedData(goQRLWideValuesGolden)).toBe(
			'0x1901d7e1065df6e44a27667668fc0e26439be6b616370f5498c838343aa16569c2468769da44475f49a3fd2df46873783825d5d07199da91e46f10b04e6a93d62e50',
		);
	});

	it('matches the go-qrl uint512 and bytes64 golden digest', () => {
		expect(getEncodedQRLTypedData(goQRLWideValuesGolden, true)).toBe(
			'0x054b04b5b0976d8b58cb06fb10c1100af45cf46488d16842897e6b2a81ed6ed3',
		);
	});

	it('keeps the old encoder export as a deprecated symbol alias', () => {
		expect(getEncodedEip712Data(goQRLWideValuesGolden, true)).toBe(
			getEncodedQRLTypedData(goQRLWideValuesGolden, true),
		);
	});

	it('rejects the obsolete EIP712Domain payload shape', () => {
		const legacyPayload = {
			...goQRLWideValuesGolden,
			types: {
				EIP712Domain: goQRLWideValuesGolden.types.QRLTypedDataDomain,
				WideValues: goQRLWideValuesGolden.types.WideValues,
			},
		} as unknown as QRLTypedData;

		expect(() => getEncodedQRLTypedData(legacyPayload, true)).toThrow(
			"Cannot encode data: type 'QRLTypedDataDomain' is not defined",
		);
	});

	it('hashes 0x-prefixed strings as literal UTF-8', () => {
		expect(getEncodedQRLTypedData(goQRLHexPrefixedStringGolden)).toBe(
			'0x19014ccfb275eb7cd58a25710eead4d1ad36b0af798c40b60d17cbaaee4050a5613192bf97dea22f5b76372c2020f39c3016b35922c3fd9a92127242cc67ff6401d7',
		);
		expect(getEncodedQRLTypedData(goQRLHexPrefixedStringGolden, true)).toBe(
			'0xa5950c17c4175f1eb8fd86634790db12f4de3ef441d6c41ffa42f592cfdcbd62',
		);
	});

	it.each(['0x', '0X1234', '0x1234'])('accepts strict dynamic bytes: %s', value => {
		expect(() => getEncodedQRLTypedData(typedValue('bytes', value), true)).not.toThrow();
	});

	it.each(['not hex', '1234', '0x123', '0xzz'])('rejects invalid dynamic bytes: %s', value => {
		expect(() => getEncodedQRLTypedData(typedValue('bytes', value), true)).toThrow(
			"Cannot encode data: value does not match type 'bytes'",
		);
	});

	it.each(['uint512[2]', 'uint512[][]'])(
		'rejects array types unsupported by current go-qrl: %s',
		type => {
			expect(() => getEncodedQRLTypedData(typedValue(type, [1, 2]), true)).toThrow(
				'Cannot encode data: invalid type definitions',
			);
		},
	);

	it.each([
		['an empty type key', { '': [] }],
		['an unused bytes65 declaration', { Unused: [{ name: 'value', type: 'bytes65' }] }],
		['an unused int08 declaration', { Unused: [{ name: 'value', type: 'int08' }] }],
		['an unused undefined reference', { Unused: [{ name: 'value', type: 'Missing' }] }],
		['a direct self-reference', { Unused: [{ name: 'value', type: 'Unused' }] }],
	])('rejects invalid type definitions containing %s', (_, extraTypes) => {
		const base = typedValue('string', 'hello');
		const data = { ...base, types: { ...base.types, ...extraTypes } } as QRLTypedData;
		expect(() => getEncodedQRLTypedData(data, true)).toThrow(
			'Cannot encode data: invalid type definitions',
		);
	});

	it('accepts the exact cycle policy used by go-qrl', () => {
		const selfArray: QRLTypedData = {
			types: {
				QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
				Node: [{ name: 'children', type: 'Node[]' }],
			},
			primaryType: 'Node',
			domain: { name: 'QRL matrix' },
			message: { children: [] },
		};
		expect(() => getEncodedQRLTypedData(selfArray, true)).not.toThrow();

		const base = typedValue('string', 'hello');
		const indirectCycle = {
			...base,
			types: {
				...base.types,
				A: [{ name: 'b', type: 'B' }],
				B: [{ name: 'a', type: 'A' }],
			},
		} as QRLTypedData;
		expect(() => getEncodedQRLTypedData(indirectCycle, true)).not.toThrow();
	});

	it('accepts a nonempty primary type key without truncating it', () => {
		const data: QRLTypedData = {
			types: {
				QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
				'Order-V1': [{ name: 'value', type: 'uint512' }],
			},
			primaryType: 'Order-V1',
			domain: { name: 'QRL matrix' },
			message: { value: 1 },
		};
		expect(() => getEncodedQRLTypedData(data, true)).not.toThrow();
	});

	it.each([
		[
			true,
			'0x19018a4c3367f0f4021fccca3bc68d014b35e552419acd1a114f936450dd3ede5bd60480d572e0de38e213063ce646555d488795d9c93928427de837a5cedface226',
			'0xe35f747c18c48cda7226bbacfcca83a86b005bf1c815544d18c8166993923993',
		],
		[
			false,
			'0x19018a4c3367f0f4021fccca3bc68d014b35e552419acd1a114f936450dd3ede5bd63d667f5caf4f244cdba2d670a3d62e2cffa3b71961d62931b5c837ccf805c0d3',
			'0x2dd65b268e60342403ae0b63ff76e7a2c4e06a0f802716cbe582ecf1b4651b0e',
		],
	])(
		'matches go-qrl primary array-key encoding (lookup type declared: %s)',
		(includeLookupType, preimage, digest) => {
			const types: QRLTypedData['types'] = {
				QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
				'Order[]': [{ name: 'y', type: 'uint8' }],
			};
			if (includeLookupType) types.Order = [{ name: 'x', type: 'uint8' }];

			const data: QRLTypedData = {
				types,
				primaryType: 'Order[]',
				domain: { name: 'QRL array primary' },
				message: { y: 1 },
			};
			expect(getEncodedQRLTypedData(data)).toBe(preimage);
			expect(getEncodedQRLTypedData(data, true)).toBe(digest);
		},
	);

	it.each([
		['', 0],
		['01', 1],
		['+1', 1],
		['0x1', 1],
		['0X1', 1],
		[BigInt(1), 1],
		[BigNumber.from(1), 1],
	])('normalizes go-qrl integer literal %p', (literal, value) => {
		expect(getEncodedQRLTypedData(typedValue('int8', literal), true)).toBe(
			getEncodedQRLTypedData(typedValue('int8', value), true),
		);
	});

	it.each(['-0x1', ' 1', '1 '])('rejects invalid go-qrl integer literal %p', literal => {
		expect(() => getEncodedQRLTypedData(typedValue('int8', literal), true)).toThrow(
			"Cannot encode data: value does not match type 'int8'",
		);
	});

	it.each([{}, { _isBigNumber: true }])('rejects unsupported integer input %p', value => {
		expect(() => getEncodedQRLTypedData(typedValue('int512', value), true)).toThrow(
			"Cannot encode data: value does not match type 'int512'",
		);
	});

	it('matches the go-qrl float64-to-int64 number conversion', () => {
		const firstUnsafeInteger = Number.MAX_SAFE_INTEGER + 1;
		expect(getEncodedQRLTypedData(typedValue('int512', firstUnsafeInteger), true)).toBe(
			getEncodedQRLTypedData(typedValue('int512', String(firstUnsafeInteger)), true),
		);
		expect(
			getEncodedQRLTypedData(domainValue('uint256', { chainId: firstUnsafeInteger }), true),
		).toBe(
			getEncodedQRLTypedData(
				domainValue('uint256', { chainId: String(firstUnsafeInteger) }),
				true,
			),
		);
		expect(() => getEncodedQRLTypedData(typedValue('int512', -(2 ** 63)), true)).not.toThrow();
		expect(() => getEncodedQRLTypedData(typedValue('int512', 2 ** 63), true)).toThrow(
			"Cannot encode data: value does not match type 'int512'",
		);
	});

	it('rejects negative unsigned integers', () => {
		expect(() => getEncodedQRLTypedData(typedValue('uint512', -1), true)).toThrow(
			"Cannot encode data: invalid negative value for unsigned type 'uint512'",
		);
	});

	it('matches go-qrl integer and fixed-bytes vectors', () => {
		expect(getEncodedQRLTypedData(typedValue('int8', 128), true)).toBe(
			'0x5a37f6a68889b8db2deab13d2f25f86ac8727218e2e83a939149bbf444e7e907',
		);
		expect(getEncodedQRLTypedData(typedValue('bytes64', `0x${'34'.repeat(64)}`), true)).toBe(
			'0xff213fb3afc21d385c27194409c9ff175f14afefc170b3bb0c9d654265f48d7b',
		);
		expect(getEncodedQRLTypedData(typedValue('bytes1', '0X12'), true)).toBe(
			getEncodedQRLTypedData(typedValue('bytes1', '0x12'), true),
		);
	});

	it('rejects fixed bytes with the wrong length', () => {
		expect(() => getEncodedQRLTypedData(typedValue('bytes2', '0x12'), true)).toThrow(
			"Cannot encode data: value does not match type 'bytes2'",
		);
	});

	it('normalizes and bounds domain chainId as a go-qrl uint256 value', () => {
		expect(getEncodedQRLTypedData(domainValue('uint256', { chainId: '' }), true)).toBe(
			'0x92558d74ba5a31c0c1570c832bef04767bddedfbcd5278a5b4d8b58039cb9cb7',
		);
		expect(getEncodedQRLTypedData(domainValue('uint256', { chainId: '0X1' }), true)).toBe(
			'0xf30452c264b0f040f2aa052128ae4105a913c5eb7ff0ff576332191289cf1bc3',
		);
		expect(getEncodedQRLTypedData(domainValue('uint256', { chainId: 2 ** 63 }))).toBe(
			'0x1901366631d4057956bf7c85f41300d1f00357c2f2394e3fb56fc7ccafeabef5306a66712fb07bda2efcfbc42464038c7a10a9f006c288b3cd5f5ad4446f632524ee',
		);
		expect(getEncodedQRLTypedData(domainValue('uint256', { chainId: 2 ** 63 }), true)).toBe(
			'0x623363c20fb28ee0bace4b4d74e0e65af81ebe6d1aa1ba685278ecef6060cee6',
		);
		expect(() =>
			getEncodedQRLTypedData(domainValue('uint256', { chainId: 1e21 }), true),
		).toThrow("Cannot encode data: value does not match domain field 'chainId'");
		expect(() =>
			getEncodedQRLTypedData(
				domainValue('uint512', { chainId: `0x${'f'.repeat(64)}` }),
				true,
			),
		).not.toThrow();
		expect(() =>
			getEncodedQRLTypedData(
				domainValue('uint512', { chainId: `0x1${'0'.repeat(64)}` }),
				true,
			),
		).toThrow("Cannot encode data: integer larger than domain field 'chainId'");
	});

	it('rejects domain values that the go-qrl domain struct cannot decode', () => {
		const wrongName = domainValue('uint256', { chainId: 1 });
		wrongName.domain.name = 123;
		expect(() => getEncodedQRLTypedData(wrongName, true)).toThrow(
			"Cannot encode data: domain field 'name' must be a string",
		);

		expect(() => getEncodedQRLTypedData(domainValue('string', { chainId: '1' }), true)).toThrow(
			"Cannot encode data: value does not match type 'string'",
		);
	});

	it('uses the go-qrl address grammar without applying a mixed-case checksum', () => {
		const mixedCaseAddress = `Q${'aA'.repeat(64)}`;
		expect(() =>
			getEncodedQRLTypedData(typedValue('address', mixedCaseAddress), true),
		).not.toThrow();
		expect(() =>
			getEncodedQRLTypedData(typedValue('address', `q${mixedCaseAddress.slice(1)}`), true),
		).toThrow("Cannot encode data: value does not match type 'address'");
	});

	it.each([1, 0, 'false'])('rejects non-boolean values: %s', value => {
		expect(() => getEncodedQRLTypedData(typedValue('bool', value), true)).toThrow(
			"Cannot encode data: value does not match type 'bool'",
		);
	});

	it.each([true, false])('accepts boolean value: %s', value => {
		expect(() => getEncodedQRLTypedData(typedValue('bool', value), true)).not.toThrow();
	});

	it('matches go-qrl signed integer magnitude bounds', () => {
		expect(() => getEncodedQRLTypedData(typedValue('int8', 255), true)).not.toThrow();
		expect(() => getEncodedQRLTypedData(typedValue('int8', -255), true)).not.toThrow();
		expect(() => getEncodedQRLTypedData(typedValue('int8', 256), true)).toThrow(
			"Cannot encode data: integer larger than 'int8'",
		);
		expect(() => getEncodedQRLTypedData(typedValue('int8', -256), true)).toThrow(
			"Cannot encode data: integer larger than 'int8'",
		);
	});

	it('rejects extra message data', () => {
		const data = typedValue('string', 'hello');
		data.message.extra = 'not declared';
		expect(() => getEncodedQRLTypedData(data, true)).toThrow(
			'Cannot encode data: extra data provided (1 < 2)',
		);
	});

	it('rejects extra data in nested structs', () => {
		const data: QRLTypedData = {
			types: {
				QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
				Envelope: [{ name: 'note', type: 'Note' }],
				Note: [{ name: 'text', type: 'string' }],
			},
			primaryType: 'Envelope',
			domain: { name: 'QRL compatibility' },
			message: { note: { text: 'hello', extra: 'not declared' } },
		};

		expect(() => getEncodedQRLTypedData(data, true)).toThrow(
			'Cannot encode data: extra data provided (1 < 2)',
		);
	});

	it('rejects an undefined domain', () => {
		const data = { ...typedValue('string', 'hello'), domain: {} } as QRLTypedData;
		expect(() => getEncodedQRLTypedData(data, true)).toThrow(
			'Cannot encode data: domain is undefined',
		);

		for (const domain of [undefined, []]) {
			expect(() =>
				getEncodedQRLTypedData(
					{ ...typedValue('string', 'hello'), domain } as unknown as QRLTypedData,
					true,
				),
			).toThrow('Cannot encode data: domain is undefined');
		}
	});
});
