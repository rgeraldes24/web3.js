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

import { Web3Context } from '@theqrl/web3-core';

import { Wallet } from '@theqrl/web3-zond-accounts';
import { getTransactionFromOrToAttr } from '../../../src/utils/transaction_builder';
import {
	validGetTransactionFromOrToAttrData,
	invalidGetTransactionFromOrToAttrData,
	invalidGetTransactionFromOrToAttrDataForWallet,
} from '../../fixtures/format_transaction';
import { createAccountProvider } from '../../fixtures/system_test_utils';

import Web3Zond from '../../../src';

describe('getTransactionFromOrToAttr', () => {
	const web3Context = new Web3Context();

	describe('valid data', () => {
		it.each(validGetTransactionFromOrToAttrData)('$title', ({ input, output }) => {
			const { role, transaction } = input;

			expect(getTransactionFromOrToAttr(role, web3Context, transaction)).toEqual(output);
		});
	});

	describe('invalid data', () => {
		it.each(invalidGetTransactionFromOrToAttrData)('$title', ({ input, output }) => {
			const { role, transaction } = input;
			expect(() => getTransactionFromOrToAttr(role, web3Context, transaction)).toThrow(
				output,
			);
		});

		it.each(invalidGetTransactionFromOrToAttrDataForWallet)(
			'$title with wallet',
			({ input, output }) => {
				const seed = '0xe6768fa565489b1a11a8541782f7ece4cd791ac92dd6dee0c8c897bafae7dc0e5e43769916b6e2d285ad4919fb1dc7aa';

				// setup wallet
				const web3Zond = new Web3Zond('http://localhost:8545');
				const accountProvider = createAccountProvider(web3Zond);
				const wallet = new Wallet(accountProvider);
				web3Zond.wallet?.add(seed);
				web3Zond['_wallet'] = wallet;

				const { role, transaction } = input;
				expect(() => getTransactionFromOrToAttr(role, web3Zond, transaction)).toThrow(
					output,
				);
			},
		);
	});
});
