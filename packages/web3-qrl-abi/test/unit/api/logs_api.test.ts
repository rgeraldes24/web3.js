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

import { decodeLog } from '../../../src/api/logs_api';
import { hexToBytes } from '@theqrl/web3-utils';
import { validDecodeLogsData } from '../../fixtures/data';

describe('logs_api', () => {
	describe('decodeLog', () => {
		it.each(['string', 'bytes', 'function', 'uint256[]', 'bytes32[2]', 'tuple'])(
			'returns the 32-byte hash for indexed %s values',
			type => {
				const hash = `0x${'ab'.repeat(32)}`;
				const topic = `${hash}${'00'.repeat(32)}`;

				const decoded = decodeLog([{ name: 'value', type, indexed: true }], '0x', [topic]);

				expect(decoded.value).toBe(hash);
			},
		);

		it('normalizes Uint8Array topics before decoding indexed hashes', () => {
			const hash = `0x${'ab'.repeat(32)}`;
			const topic = hexToBytes(`${hash}${'00'.repeat(32)}`);

			const decoded = decodeLog([{ name: 'value', type: 'string', indexed: true }], '0x', [
				topic,
			]);

			expect(decoded.value).toBe(hash);
		});

		it.each([33, 64])('decodes indexed bytes%d without VM word padding', size => {
			const value = `0x${'ab'.repeat(size)}`;
			const topic = `${value}${'00'.repeat(64 - size)}`;

			const decoded = decodeLog(
				[{ name: 'value', type: `bytes${size}`, indexed: true }],
				'0x',
				[topic],
			);

			expect(decoded.value).toBe(value);
		});

		describe('valid data', () => {
			it.each(validDecodeLogsData)(
				'should pass for valid values: %j',
				({ input: { abi, data, topics }, output }) => {
					const expected = decodeLog(abi, data, topics);
					expect(JSON.parse(JSON.stringify(expected))).toEqual(output);
				},
			);
		});
	});
});
