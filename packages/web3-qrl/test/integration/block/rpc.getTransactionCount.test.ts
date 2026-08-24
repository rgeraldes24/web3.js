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
import { SupportedProviders, FMT_BYTES, FMT_NUMBER } from '@theqrl/web3-types';
import { Web3QRL } from '../../../src';
import {
	getSystemTestProvider,
	createTempAccount,
	closeOpenConnection,
} from '../../fixtures/system_test_utils';
import { toAllVariants } from '../../shared_fixtures/utils';
import { sendFewTxes } from '../helper';

describe('rpc with block', () => {
	let web3QRL: Web3QRL;
	let clientUrl: string | SupportedProviders;

	beforeAll(() => {
		clientUrl = getSystemTestProvider();
		web3QRL = new Web3QRL({
			provider: clientUrl,
			config: {
				transactionPollingTimeout: 5000,
			},
		});
	});
	afterAll(async () => {
		await closeOpenConnection(web3QRL);
	});

	describe('methods', () => {
		it.each(
			toAllVariants<{
				block: 'latest' | 'pending' | 'blockNumber';
				format: string;
			}>({
				block: ['latest', 'pending', 'blockNumber'],
				format: Object.values(FMT_NUMBER),
			}),
		)('getTransactionCount', async ({ block, format }) => {
			const acc = await createTempAccount();
			const [receipt] = await sendFewTxes({
				from: acc.address,
				value: '0x1',
				times: 1,
			});
			const beforeBlock = block === 'blockNumber' ? Number(receipt.blockNumber) : block;
			const countBefore = await web3QRL.getTransactionCount(acc.address, beforeBlock, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			const count = 2;
			const res = await sendFewTxes({
				from: acc.address,
				value: '0x1',
				times: count,
			});
			const receiptAfter = res[res.length - 1];
			const afterBlock = block === 'blockNumber' ? Number(receiptAfter.blockNumber) : block;
			const countAfter = await web3QRL.getTransactionCount(acc.address, afterBlock, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			});
			expect(Number(countAfter) - Number(countBefore)).toBe(count);
		});
	});
});
