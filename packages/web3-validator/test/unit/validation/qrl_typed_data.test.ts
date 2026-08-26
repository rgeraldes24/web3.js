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

import {
	isEip712TypedData,
	isQRLTypedData as isQRLTypedDataFromDeprecatedModule,
} from '../../../src/validation/eip712';
import {
	isQRLTypedData,
	isQRLTypedDataTypeDefinitions,
} from '../../../src/validation/qrl_typed_data';
import { validator } from '../../../src/default_validator';

// A minimal but complete QRL Typed Structured Data v1 payload. Every negative case below is this
// object with exactly one thing broken, so each test pins one encoder precondition.
const validTypedData = {
	types: {
		QRLTypedDataDomain: [
			{ name: 'name', type: 'string' },
			{ name: 'version', type: 'string' },
			{ name: 'chainId', type: 'uint256' },
		],
		Message: [{ name: 'contents', type: 'string' }],
	},
	primaryType: 'Message',
	domain: { name: 'QRL', version: '1', chainId: 1 },
	message: { contents: 'hello' },
};

const clone = () => JSON.parse(JSON.stringify(validTypedData)) as Record<string, any>;

describe('validation', () => {
	describe('isQRLTypedData', () => {
		it('should accept a well-formed typed data object', () => {
			expect(isQRLTypedData(validTypedData)).toBe(true);
		});

		// eslint-disable-next-line no-null/no-null
		it.each([undefined, null, 'string', 42, true, [], () => undefined])(
			'should reject a non-object value: %s',
			value => {
				expect(isQRLTypedData(value)).toBe(false);
			},
		);

		it('should reject when types is missing', () => {
			const data = clone();
			delete data.types;
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should reject when types is not a plain object', () => {
			const data = clone();
			data.types = [];
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should reject when types.QRLTypedDataDomain is missing', () => {
			const data = clone();
			delete data.types.QRLTypedDataDomain;
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should reject when types.QRLTypedDataDomain is not an array', () => {
			const data = clone();
			data.types.QRLTypedDataDomain = {};
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should reject a type member that is not an object', () => {
			const data = clone();
			data.types.Message = ['contents'];
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each(['name', 'type'])('should reject a type member missing %s', field => {
			const data = clone();
			delete data.types.Message[0][field];
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each(['name', 'type'])('should reject a type member whose %s is empty', field => {
			const data = clone();
			data.types.Message[0][field] = '';
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each(['name', 'type'])('should reject a type member whose %s is not a string', field => {
			const data = clone();
			data.types.Message[0][field] = 42;
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each(['string[2]', 'string[][]'])(
			'should reject an array type unsupported by current go-qrl: %s',
			type => {
				const data = clone();
				data.types.Message[0].type = type;
				expect(isQRLTypedData(data)).toBe(false);
			},
		);

		it.each([
			['empty type key', { '': [] }],
			['invalid bytes width', { Unused: [{ name: 'value', type: 'bytes65' }] }],
			['noncanonical integer width', { Unused: [{ name: 'value', type: 'int08' }] }],
			['undefined reference', { Unused: [{ name: 'value', type: 'Missing' }] }],
			['direct self-reference', { Unused: [{ name: 'value', type: 'Unused' }] }],
		])('should reject type definitions containing an %s', (_, extraTypes) => {
			const data = clone();
			data.types = { ...data.types, ...extraTypes };
			expect(isQRLTypedDataTypeDefinitions(data.types)).toBe(false);
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should match the go-qrl cycle and primary-key policy', () => {
			const selfArray = clone();
			selfArray.types.Node = [{ name: 'children', type: 'Node[]' }];
			expect(isQRLTypedDataTypeDefinitions(selfArray.types)).toBe(true);

			const indirectCycle = clone();
			indirectCycle.types.A = [{ name: 'b', type: 'B' }];
			indirectCycle.types.B = [{ name: 'a', type: 'A' }];
			expect(isQRLTypedDataTypeDefinitions(indirectCycle.types)).toBe(true);

			const nonIdentifierPrimary = clone();
			nonIdentifierPrimary.types['Order-V1'] = [{ name: 'value', type: 'uint512' }];
			nonIdentifierPrimary.primaryType = 'Order-V1';
			nonIdentifierPrimary.message = { value: 1 };
			expect(isQRLTypedData(nonIdentifierPrimary)).toBe(true);
		});

		it.each([undefined, '', 42, {}])('should reject primaryType: %s', primaryType => {
			const data = clone();
			data.primaryType = primaryType;
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should reject a primaryType that is not declared in types', () => {
			const data = clone();
			data.primaryType = 'NotDeclared';
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each(['domain', 'message'])('should reject when %s is missing', field => {
			const data = clone();
			delete data[field];
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each(['domain', 'message'])('should reject when %s is not a plain object', field => {
			const data = clone();
			data[field] = 'not-an-object';
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should reject an undefined domain', () => {
			const data = clone();
			data.domain = {};
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each([
			['wrong-typed known field', { name: 123, chainId: 1 }],
			['invalid chainId syntax', { chainId: '-0x1' }],
			['over-wide chainId', { chainId: `0x1${'0'.repeat(64)}` }],
			['exponent-form numeric chainId', { chainId: 1e21 }],
		])('should reject an invalid or unsupported domain: %s', (_, domain) => {
			const data = clone();
			data.domain = domain;
			expect(isQRLTypedData(data)).toBe(false);
		});

		it.each([
			{ chainId: '' },
			{ chainId: '+1' },
			{ chainId: '0X1' },
			{ chainId: Number.MAX_SAFE_INTEGER + 1 },
			{ chainId: 2 ** 63 },
		])('should accept a go-qrl-compatible chainId: %p', domain => {
			const data = clone();
			data.domain = domain;
			expect(isQRLTypedData(data)).toBe(true);
		});

		it('should reject extra message fields', () => {
			const data = clone();
			data.message.extra = 'not declared';
			expect(isQRLTypedData(data)).toBe(false);
		});

		it('should accept unknown top-level keys', () => {
			const data = clone();
			data.someProviderExtension = { anything: true };
			expect(isQRLTypedData(data)).toBe(true);
		});

		it('keeps the old validator export as a deprecated symbol alias', () => {
			expect(isEip712TypedData(validTypedData)).toBe(true);
			expect(isQRLTypedDataFromDeprecatedModule(validTypedData)).toBe(true);
		});
	});

	describe('qrlTypedData format wiring', () => {
		it('should pass validation for well-formed typed data', () => {
			expect(() => validator.validate(['qrlTypedData'], [validTypedData])).not.toThrow();
		});

		it('should throw Web3ValidatorError for malformed typed data', () => {
			const data = clone();
			delete data.types.QRLTypedDataDomain;
			expect(() => validator.validate(['qrlTypedData'], [data])).toThrow();
		});

		it('keeps the old format name as a deprecated alias', () => {
			expect(() => validator.validate(['eip712TypedData'], [validTypedData])).not.toThrow();
		});
	});
});
