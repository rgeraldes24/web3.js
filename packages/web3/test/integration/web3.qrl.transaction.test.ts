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

import * as httpProvider from '@theqrl/web3-providers-http';
import { recoverTransaction, TransactionFactory, Web3Account } from '@theqrl/web3-qrl-accounts';
import { hexToBytes } from '@theqrl/web3-utils';
import Web3, { DEFAULT_RETURN_FORMAT, Transaction } from '../../src';
// TODO(youtrack/theqrl/web3.js/8)
import testsData from '../fixtures/transactions.json';

jest.mock('@theqrl/web3-providers-http');

describe('signTransaction', () => {
	let blockNum = 1;

	it.each(testsData)(
		'Integration test of transaction %s with Web3, Web3.QRL, Web3.Accounts and Provider should pass',
		async txObj => {
			const web3: Web3 = new Web3('http://127.0.0.1:8080');

			const account: Web3Account = web3.qrl.accounts.seedToAccount(txObj.seed);

			web3.qrl.wallet?.add(txObj.seed);
			let sentRawTransaction: unknown;

			const normalTx: Transaction = {
				...txObj.transaction,
				from: account.address,
			};

			jest.spyOn(httpProvider.HttpProvider.prototype, 'request').mockImplementation(
				async (payload: any) => {
					const response = {
						jsonrpc: '2.0',
						id: payload.id,
						result: {},
					};

					switch (payload.method) {
						case 'net_version':
							response.result = '1';
							break;

						case 'qrl_chainId':
							response.result = '0x1';
							break;

						case 'qrl_blockNumber':
							blockNum += 10;
							response.result = `0x${blockNum.toString(16)}`;
							break;

						case 'qrl_getTransactionReceipt':
							response.result = {
								blockHash:
									'0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3',
								blockNumber: `0x${blockNum.toString(16)}`,
								cumulativeGasUsed: '0xa12515',
								// "effectiveGasPrice": payload.effectiveGasPrice,
								from: payload.from,
								gasUsed: payload.gasLimit,
								// "logs": [{}],
								// "logsBloom": "0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3", // 256 byte bloom filter
								status: '0x1',
								to: payload.to,
								transactionHash:
									'0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5',
								transactionIndex: '0x66',
								// "type": payload.type
							};
							break;

						case 'qrl_sendRawTransaction':
							[sentRawTransaction] = payload.params;

							// if (txObj.transaction.maxPriorityFeePerGas !== undefined) {
							// 	// eslint-disable-next-line jest/no-conditional-expect
							// 	expect(payload.params[0]).toBe(txObj.signedLondon); // validate transaction for London HF
							// } else {
							// 	// eslint-disable-next-line jest/no-conditional-expect
							// 	expect(payload.params[0]).toBe(txObj.signedBerlin); // validate transaction for Berlin HF
							// }
							response.result =
								'0x895ebb29d30e0afa891a5ca3a2687e073bd2c7ab544117ac386c8d8ff3ad583b';
							break;

						default:
							throw new Error(`Unknown payload ${JSON.stringify(payload)}`);
					}

					return new Promise(resolve => {
						resolve(response as any);
					});
				},
			);

			const res = await web3.qrl.sendTransaction(normalTx, DEFAULT_RETURN_FORMAT, {
				ignoreGasPricing: true,
				checkRevertBeforeSending: false,
			});
			expect(res).toBeDefined();
			expect(typeof sentRawTransaction).toBe('string');

			const raw = sentRawTransaction as string;
			const serialized = hexToBytes(raw);
			const decoded = TransactionFactory.fromSerializedData(serialized);

			expect(decoded.type).toBe(2);
			expect(decoded.serialize()).toEqual(serialized);
			expect(decoded.verifySignature()).toBe(true);
			expect(decoded.signature).toHaveLength(4627);
			expect(decoded.publicKey).toHaveLength(2592);
			expect(decoded.toJSON()).toEqual({
				chainId: '0xac9f74e3',
				nonce: '0xf',
				maxPriorityFeePerGas: '0x91bcff',
				maxFeePerGas: '0x58e8d1dda1',
				gasLimit: '0x331bce0f90',
				to: 'Qf9589a1b6adb39cd9eb381aefbf57557bcc4a5b56f4c8884068dc1d23581d4c800a9b877453f7654a21a360acc5122ce0bbbd2579e00b212d6e4d252ab48f466',
				value: '0x91e32e2f5a',
				data: '0xe0d1a7227d34c2ca72e3c0',
				accessList: [
					{
						address:
							'0x818571db013a56a404e8441680008405e4651b28d322b9c276a30290cfe057b7d8fdc056bdfb5a3dfdd047c61eb77cd95dca2f88c0861d89e5dcc2c8e26af1d5',
						storageKeys: [],
					},
				],
				descriptor: '0x010000',
				extraParams: undefined,
				signature: expect.any(String),
				publicKey: expect.any(String),
			});

			expect(recoverTransaction(raw)).toBe(account.address);
		},
	);
});
