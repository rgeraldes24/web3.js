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
import { TransactionWithSenderAPI, BlockTags, BlockNumberOrTag } from '@theqrl/web3-types';

export const mockRpcResponse = '0x5208';

const transaction: Partial<TransactionWithSenderAPI> = {
	from: 'ZEB014f8c8B418Db6b45774c326A0E64C78914dC0',
	to: 'Z3535353535353535353535353535353535353535',
	value: '0x174876e800',
	gas: '0x5208',
	type: '0x2',
	maxFeePerGas: '0x1229298c00',
	maxPriorityFeePerGas: '0x49504f80',
	data: '0x',
	nonce: '0x4',
	chainId: '0x1',
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 * 	   - transaction
 *     - blockNumber
 */
type TestData = [string, [Partial<TransactionWithSenderAPI>, BlockNumberOrTag]];
export const testData: TestData[] = [
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.LATEST`,
		[transaction, BlockTags.LATEST],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.EARLIEST`,
		[transaction, BlockTags.EARLIEST],
	],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.PENDING`,
		[transaction, BlockTags.PENDING],
	],
	[`${JSON.stringify(transaction)}\nblockNumber = BlockTags.SAFE`, [transaction, BlockTags.SAFE]],
	[
		`${JSON.stringify(transaction)}\nblockNumber = BlockTags.FINALIZED`,
		[transaction, BlockTags.FINALIZED],
	],
	[`${JSON.stringify(transaction)}\nblockNumber = "0x4b7"`, [transaction, '0x4b7']],
];
