﻿/*
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
	ZondExecutionAPI,
	PopulatedUnsignedEip1559Transaction,
	Transaction,
	ValidChains,
	Hardfork,
} from '@theqrl/web3-types';
import { Web3Context } from '@theqrl/web3-core';
import HttpProvider from '@theqrl/web3-providers-http';
import { isNullish } from '@theqrl/web3-validator';
import { zondRpcMethods } from '@theqrl/web3-rpc-methods';

import {
	TransactionDataAndInputError,
	UnableToPopulateNonceError,
	UnsupportedTransactionTypeError,
} from '@theqrl/web3-errors';
import { defaultTransactionBuilder } from '../../src/utils/transaction_builder';

jest.mock('@theqrl/web3-rpc-methods');

const expectedNetworkId = '0x4';
jest.mock('@theqrl/web3-net', () => ({
	getId: jest.fn().mockImplementation(() => expectedNetworkId),
}));

describe('defaultTransactionBuilder', () => {
	const expectedFrom = 'Z206E7Ec6854337F059BF6b637ac7cECd2F3D1933';
	const expectedNonce = '0x42';
	const expectedGas = BigInt(21000);
	const expectedGasLimit = expectedGas;
	const expectedGasPrice = '0x4a817c800';
	const expectedBaseFeePerGas = '0x13afe8b904';
	const expectedMaxPriorityFeePerGas = '0x9502f900';
	const expectedMaxFeePerGas = '0x27f4d46b08';
	const expectedChainId = '0x1';
	const defaultTransactionType = '0x2';
	const transaction: Transaction = {
		from: expectedFrom,
		to: 'Z3535353535353535353535353535353535353535',
		value: '0x174876e800',
		gas: expectedGas,
		gasLimit: expectedGasLimit,
		type: '0x2',
		maxFeePerGas: expectedMaxFeePerGas,
		maxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
		data: '0x',
		nonce: expectedNonce,
		chain: 'mainnet',
		hardfork: 'shanghai',
		chainId: expectedChainId,
		networkId: expectedNetworkId,
		common: {
			customChain: {
				name: 'foo',
				networkId: expectedNetworkId,
				chainId: expectedChainId,
			},
			baseChain: 'mainnet',
			hardfork: 'shanghai',
		},
	};
	const mockBlockData = {
		parentHash: '0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54',
		miner: 'Zbb7b8287f3f0a933474a79eae42cbca977791171',
		stateRoot: '0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d',
		transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
		logsBloom:
			'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		number: '0x1b4',
		gasLimit: '0x1388',
		gasUsed: '0x1c96e73',
		timestamp: '0x55ba467c',
		extraData: '0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32',
		prevRandao: '0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843',
		size: '0x220',
		transactions: [
			'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
			'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
			'0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b',
		],
		hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
		baseFeePerGas: expectedBaseFeePerGas,
	};
	let web3Context: Web3Context<ZondExecutionAPI>;
	let getTransactionCountSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.spyOn(zondRpcMethods, 'getBlockByNumber').mockResolvedValue(mockBlockData);
		getTransactionCountSpy = jest
			.spyOn(zondRpcMethods, 'getTransactionCount')
			.mockResolvedValue(expectedNonce);
		jest.spyOn(zondRpcMethods, 'getGasPrice').mockResolvedValue(expectedGasPrice);
		jest.spyOn(zondRpcMethods, 'getChainId').mockResolvedValue(expectedChainId);

		web3Context = new Web3Context<ZondExecutionAPI>(new HttpProvider('http://127.0.0.1'));
	});

	it.skip('should call override method', async () => {
		const overrideFunction = jest.fn();
		const input = { ...transaction };
		await defaultTransactionBuilder({
			transaction: input,
			web3Context,
			// VALID_ZOND_BASE_TYPES.HexString,
			// '0xe6768fa565489b1a11a8541782f7ece4cd791ac92dd6dee0c8c897bafae7dc0e5e43769916b6e2d285ad4919fb1dc7aa',
			// overrideFunction,
			fillGasPrice: true,
		});
		expect(overrideFunction).toHaveBeenCalledWith(input);
	});

	describe('should populate from', () => {
		it('should use seed to populate', async () => {
			const input = { ...transaction };
			delete input.from;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				seed: '0x71e121bdd81cdae8da5a9733bb6c1cd5a43feb8a2cc754a4aeb797cbc2054626e77c05ddad0182ef962233ca6c5906c6',
				fillGasPrice: true,
			});
			expect(result.from).toBe(expectedFrom);
		});

		it('should use web3Context.defaultAccount to populate', async () => {
			web3Context = new Web3Context<ZondExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultAccount: expectedFrom,
				},
			});

			const input = { ...transaction };
			delete input.from;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.from).toBe(expectedFrom);
		});
	});

	describe('should populate nonce', () => {
		it('should throw UnableToPopulateNonceError', async () => {
			const input = { ...transaction };
			delete input.from;
			delete input.nonce;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			await expect(
				defaultTransactionBuilder({ transaction: input, web3Context, fillGasPrice: true }),
			).rejects.toThrow(new UnableToPopulateNonceError());
		});

		it('should use web3Zond.getTransactionCount to populate nonce', async () => {
			const input = { ...transaction };
			delete input.nonce;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.nonce).toBe(expectedNonce);
			expect(getTransactionCountSpy).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedFrom,
				web3Context.defaultBlock,
			);
		});

		it('should use web3Zond.getTransactionCount to populate nonce without gas fill', async () => {
			const input = { ...transaction };
			delete input.nonce;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: false,
			});
			expect(result.nonce).toBe(expectedNonce);
			expect(getTransactionCountSpy).toHaveBeenCalledWith(
				web3Context.requestManager,
				expectedFrom,
				web3Context.defaultBlock,
			);
		});
	});

	describe('should populate value', () => {
		it('should populate with 0x', async () => {
			const input = { ...transaction };
			delete input.value;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.value).toBe('0x');
		});
	});

	describe('should populate input/data', () => {
		it('should populate input with 0x', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			delete input.data;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.input).toBe('0x');
			expect(result.data).toBeUndefined();
		});

		it('should prefix input with 0x', async () => {
			const input = { ...transaction };
			input.input = '123';
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			delete input.data;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.input).toBe('0x123');
			expect(result.data).toBeUndefined();
		});

		it('should prefix data with 0x', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			input.data = '123';

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.input).toBeUndefined();
			expect(result.data).toBe('0x123');
		});

		it('should throw TransactionDataAndInputError', async () => {
			const input = { ...transaction };
			input.data = '0x3211';
			input.input = '0x1233';

			await expect(
				defaultTransactionBuilder({
					transaction: input,
					web3Context,
				}),
			).rejects.toThrow(TransactionDataAndInputError);
		});
	});

	describe('should populate chain', () => {
		it('should populate with mainnet', async () => {
			const input = { ...transaction };
			delete input.chain;
			delete input.common;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.chain).toBe('mainnet');
		});

		it('should use web3Context.defaultChain to populate', async () => {
			web3Context = new Web3Context<ZondExecutionAPI>(new HttpProvider('http://127.0.0.1'));

			const input = { ...transaction };
			delete input.chain;
			delete input.common;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.chain).toBe(web3Context.defaultChain);
		});
	});

	describe('should populate hardfork', () => {
		it('should populate with shanghai', async () => {
			const input = { ...transaction };
			delete input.hardfork;
			delete input.common;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.hardfork).toBe('shanghai');
		});

		it('should use web3Context.defaultHardfork to populate', async () => {
			web3Context = new Web3Context<ZondExecutionAPI>(new HttpProvider('http://127.0.0.1'));

			const input = { ...transaction };
			delete input.hardfork;
			delete input.common;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.hardfork).toBe(web3Context.defaultHardfork);
		});

		it('should use web3Context.defaultCommon to populate', async () => {
			const baseChain: ValidChains = 'mainnet';
			const hardfork: Hardfork = 'shanghai';
			const customCommon = {
				customChain: {
					name: 'custom',
					networkId: '0x3',
					chainId: '0x1',
				},
				baseChain,
				hardfork,
			};

			web3Context = new Web3Context<ZondExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultCommon: customCommon,
				},
			});

			const input = { ...transaction };
			delete input.common;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.common).toStrictEqual(customCommon);
		});
	});

	describe('should populate chainId', () => {
		it('should populate with web3Zond.getChainId', async () => {
			const input = { ...transaction };
			delete input.chainId;
			delete input.common;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.chainId).toBe(expectedChainId);
		});
	});

	describe('should populate networkId', () => {
		it('should populate with web3Net.getId', async () => {
			const input = { ...transaction };
			delete input.networkId;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.networkId).toBe(expectedNetworkId);
		});
	});

	describe('should populate gasLimit', () => {
		it('should populate with gas', async () => {
			const input = { ...transaction };
			delete input.gasLimit;
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.gasLimit).toBe(expectedGasLimit);
		});
	});

	describe('should populate type', () => {
		it('should throw UnsupportedTransactionTypeError', async () => {
			const input = { ...transaction };
			input.type = '0x8'; // // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2718.md#transactions

			await expect(
				defaultTransactionBuilder({ transaction: input, web3Context, fillGasPrice: true }),
			).rejects.toThrow(new UnsupportedTransactionTypeError(input.type));
		});

		it('should use web3Context.defaultTransactionType to populate', async () => {
			web3Context = new Web3Context<ZondExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultTransactionType,
				},
			});

			const input = { ...transaction };
			delete input.gas;
			delete input.gasLimit;
			delete input.maxFeePerGas;
			delete input.maxPriorityFeePerGas;
			delete input.accessList;
			delete input.type;

			input.hardfork = 'shanghai';
			if (!isNullish(input.common)) input.common.hardfork = 'shanghai';

			const result = await defaultTransactionBuilder({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.type).toBe(web3Context.defaultTransactionType);
		});
	});

	describe('should populate accessList', () => {
		it('should populate with [] (tx.type 0x2)', async () => {
			const input = { ...transaction };
			delete input.accessList;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.accessList).toStrictEqual([]);
		});
	});

	describe('should populate maxPriorityFeePerGas and maxFeePerGas', () => {
		it('should populate with maxPriorityFeePerGas and maxFeePerGas', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});

			expect(result.maxFeePerGas).toBeDefined();
			expect(result.maxPriorityFeePerGas).toBeDefined();
		});

		it('should populate with default maxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas and maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedMaxPriorityFeePerGas); // 2.5 Gplanck, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with default maxPriorityFeePerGas and calculated maxFeePerGas (no maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxFeePerGas;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedMaxPriorityFeePerGas); // 2.5 Gplanck, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with default maxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			input.type = '0x2';

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.maxPriorityFeePerGas).toBe(expectedMaxPriorityFeePerGas); // 2.5 Gplanck, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with web3Context.defaultMaxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas and maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			delete input.maxFeePerGas;
			input.type = '0x2';

			web3Context = new Web3Context<ZondExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultMaxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
				},
			});

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.maxPriorityFeePerGas).toBe(web3Context.defaultMaxPriorityFeePerGas); // 2.5 Gplanck, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with web3Context.defaultMaxPriorityFeePerGas and calculated maxFeePerGas (no maxFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxFeePerGas;
			input.type = '0x2';

			web3Context = new Web3Context<ZondExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultMaxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
				},
			});

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.maxPriorityFeePerGas).toBe(web3Context.defaultMaxPriorityFeePerGas); // 2.5 Gplanck, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});

		it('should populate with web3Context.defaultMaxPriorityFeePerGas and calculated maxFeePerGas (no maxPriorityFeePerGas)', async () => {
			const input = { ...transaction };
			delete input.maxPriorityFeePerGas;
			input.type = '0x2';

			web3Context = new Web3Context<ZondExecutionAPI>({
				provider: new HttpProvider('http://127.0.0.1'),
				config: {
					defaultMaxPriorityFeePerGas: expectedMaxPriorityFeePerGas,
				},
			});

			const result = await defaultTransactionBuilder<PopulatedUnsignedEip1559Transaction>({
				transaction: input,
				web3Context,
				fillGasPrice: true,
			});
			expect(result.maxPriorityFeePerGas).toBe(web3Context.defaultMaxPriorityFeePerGas); // 2.5 Gplanck, hardcoded in defaultTransactionBuilder;
			expect(result.maxFeePerGas).toBe(expectedMaxFeePerGas);
		});
	});
});
