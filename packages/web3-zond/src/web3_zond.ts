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

// Disabling because returnTypes must be last param to match 1.x params
/* eslint-disable default-param-last */

import {
	SupportedProviders,
	Address,
	Bytes,
	Filter,
	HexString32Bytes,
	Numbers,
	BlockNumberOrTag,
	LogsOutput,
	Transaction,
	TransactionCall,
	Web3ZondExecutionAPI,
	TransactionWithFromLocalWalletIndex,
	TransactionWithToLocalWalletIndex,
	TransactionWithFromAndToLocalWalletIndex,
	TransactionForAccessList,
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	Eip712TypedData,
	FeeData,
	FMT_BYTES,
	FMT_NUMBER,
} from '@theqrl/web3-types';
import { isSupportedProvider, Web3Context, Web3ContextInitOptions } from '@theqrl/web3-core';
import { TransactionNotFound } from '@theqrl/web3-errors';
import { toChecksumAddress, isNullish, zondUnitMap } from '@theqrl/web3-utils';
import { zondRpcMethods } from '@theqrl/web3-rpc-methods';

import * as rpcMethodsWrappers from './rpc_method_wrappers.js';
import { SendTransactionOptions } from './types.js';
import {
	LogsSubscription,
	NewPendingTransactionsSubscription,
	NewHeadsSubscription,
	SyncingSubscription,
} from './web3_subscriptions.js';

export type RegisteredSubscription = {
	logs: typeof LogsSubscription;
	newPendingTransactions: typeof NewPendingTransactionsSubscription;
	pendingTransactions: typeof NewPendingTransactionsSubscription;
	newHeads: typeof NewHeadsSubscription;
	newBlockHeaders: typeof NewHeadsSubscription;
	syncing: typeof SyncingSubscription;
};

export const registeredSubscriptions = {
	logs: LogsSubscription,
	newPendingTransactions: NewPendingTransactionsSubscription,
	newHeads: NewHeadsSubscription,
	syncing: SyncingSubscription,
	pendingTransactions: NewPendingTransactionsSubscription, // the same as newPendingTransactions. just for support API like in version 1.x
	newBlockHeaders: NewHeadsSubscription, // the same as newHeads. just for support API like in version 1.x
};

export class Web3Zond extends Web3Context<Web3ZondExecutionAPI, RegisteredSubscription> {
	public constructor(
		providerOrContext?: SupportedProviders<any> | Web3ContextInitOptions | string,
	) {
		if (
			typeof providerOrContext === 'string' ||
			isSupportedProvider(providerOrContext as SupportedProviders<any>)
		) {
			super({
				provider: providerOrContext as SupportedProviders<any>,
				registeredSubscriptions,
			});

			return;
		}

		if ((providerOrContext as Web3ContextInitOptions).registeredSubscriptions) {
			super(providerOrContext as Web3ContextInitOptions);
			return;
		}

		super({
			...(providerOrContext as Web3ContextInitOptions),
			registeredSubscriptions,
		});
	}

	/**
	 * @returns Returns the zond protocol version of the node.
	 *
	 * ```ts
	 * web3.zond.getProtocolVersion().then(console.log);
	 * > "63"
	 * ```
	 */
	public async getProtocolVersion() {
		return zondRpcMethods.getProtocolVersion(this.requestManager);
	}

	// TODO Add returnFormat parameter
	/**
	 * Checks if the node is currently syncing.
	 *
	 * @returns Either a {@link SyncingStatusAPI}, or `false`.
	 *
	 * ```ts
	 * web3.zond.isSyncing().then(console.log);
	 * > {
	 *     startingBlock: 100,
	 *     currentBlock: 312,
	 *     highestBlock: 512,
	 *     knownStates: 234566,
	 *     pulledStates: 123455
	 * }
	 * ```
	 */
	public async isSyncing() {
		return zondRpcMethods.getSyncing(this.requestManager);
	}

	/**
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The gas price determined by the last few blocks median gas price.
	 *
	 * ```ts
	 * web3.zond.getGasPrice().then(console.log);
	 * > 20000000000n
	 *
	 * web3.zond.getGasPrice({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > "0x4a817c800"
	 * ```
	 */
	public async getGasPrice<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getGasPrice(this, returnFormat);
	}

	/**
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns the current maxPriorityFeePerGas per gas in planck.
	 *
	 * ```ts
	 * web3.zond.getMaxPriorityFeePerGas().then(console.log);
	 * > 20000000000n
	 *
	 * web3.zond.getMaxPriorityFeePerGas({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > "0x4a817c800"
	 * ```
	 */
	public async getMaxPriorityFeePerGas<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat) {
		return rpcMethodsWrappers.getMaxPriorityFeePerGas(this, returnFormat);
	}

	/**
	 * Calculates the current Fee Data.
	 * `maxFeePerGas` and `maxPriorityFeePerGas` will be calculated.
	 *
	 * @param baseFeePerGasFactor The factor to multiply the baseFeePerGas with, if the node supports EIP-1559.
	 * @param alternativeMaxPriorityFeePerGas The alternative maxPriorityFeePerGas to use, if the node supports EIP-1559, but does not support the method `zond_maxPriorityFeePerGas`.
	 * @returns The current fee data.
	 *
	 * ```ts
	 * web3.zond.calculateFeeData().then(console.log);
	 * > {
	 *     maxFeePerGas: 20000000000n,
	 *     maxPriorityFeePerGas: 20000000000n,
	 * 	   baseFeePerGas: 20000000000n
	 * }
	 *
	 * web3.zond.calculateFeeData(zondUnitMap.Gplanck, 2n).then(console.log);
	 * > {
	 *     maxFeePerGas: 40000000000n,
	 *     maxPriorityFeePerGas: 20000000000n,
	 * 	   baseFeePerGas: 20000000000n
	 * }
	 * ```
	 */
	public async calculateFeeData(
		baseFeePerGasFactor = BigInt(2),
		alternativeMaxPriorityFeePerGas = zondUnitMap.Gplanck,
	): Promise<FeeData> {
		const block = await this.getBlock<{ number: FMT_NUMBER.BIGINT; bytes: FMT_BYTES.HEX }>(
			undefined,
			false,
		);

		const baseFeePerGas: bigint | undefined = block?.baseFeePerGas ?? undefined; // use undefined if it was null

		let maxPriorityFeePerGas: bigint | undefined;
		try {
			maxPriorityFeePerGas = await this.getMaxPriorityFeePerGas<{
				number: FMT_NUMBER.BIGINT;
				bytes: FMT_BYTES.HEX;
			}>();
		} catch (error) {
			// do nothing
		}

		let maxFeePerGas: bigint | undefined;
		// if the `block.baseFeePerGas` is available, then EIP-1559 is supported
		// and we can calculate the `maxFeePerGas` from the `block.baseFeePerGas`
		if (baseFeePerGas) {
			// tip the miner with alternativeMaxPriorityFeePerGas, if no value available from getMaxPriorityFeePerGas
			maxPriorityFeePerGas = maxPriorityFeePerGas ?? alternativeMaxPriorityFeePerGas;
			// basically maxFeePerGas = (baseFeePerGas +- 12.5%) + maxPriorityFeePerGas
			// and we multiply the `baseFeePerGas` by `baseFeePerGasFactor`, to allow
			// trying to include the transaction in the next few blocks even if the
			// baseFeePerGas is increasing fast
			maxFeePerGas = baseFeePerGas * baseFeePerGasFactor + maxPriorityFeePerGas;
		}

		return { maxFeePerGas, maxPriorityFeePerGas, baseFeePerGas };
	}

	/**
	 * @returns A list of accounts the node controls (addresses are checksummed).
	 *
	 * ```ts
	 * web3.zond.getAccounts().then(console.log);
	 * > ["Z11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "ZDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]
	 * ```
	 */
	public async getAccounts() {
		const hexAddresses = (await zondRpcMethods.getAccounts(this.requestManager)) ?? [];
		return hexAddresses.map(address => toChecksumAddress(address));
	}

	/**
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The current block number.
	 *
	 * ```ts
	 * web3.zond.getBlockNumber().then(console.log);
	 * > 2744n
	 *
	 * web3.zond.getBlockNumber({ number: FMT_NUMBER.HEX , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > "0xab8"
	 * ```
	 */
	public async getBlockNumber<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockNumber(this, returnFormat);
	}

	/**
	 * Get the balance of an address at a given block.
	 *
	 * @param address The address to get the balance of.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) Specifies what block to use as the current state for the balance query.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The current balance for the given address in `planck`.
	 *
	 * ```ts
	 * web3.zond.getBalance("Z407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
	 * > 1000000000000n
	 *
	 * web3.zond.getBalance("Z407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
	 * > "0xe8d4a51000"
	 * ```
	 */
	public async getBalance<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBalance(this, address, blockNumber, returnFormat);
	}

	/**
	 * Get the storage at a specific position of an address.
	 *
	 * @param address The address to get the storage from.
	 * @param storageSlot The index position of the storage.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) Specifies what block to use as the current state for the storage query.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The value in storage at the given position.
	 *
	 * ```ts
	 * web3.zond.getStorageAt("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234", 0).then(console.log);
	 * > "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"
	 *
	 * web3.zond.getStorageAt(
	 *      "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234",
	 *      0,
	 *      undefined,
	 *      { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.UINT8ARRAY }
	 * ).then(console.log);
	 * > Uint8Array(31) [
	 *       3, 52,  86, 115,  33,  35, 255, 255,
	 *       35, 66,  52,  45, 209,  35,  66,  67,
	 *       67, 36,  35,  66,  52, 253,  35,  79,
	 *       210, 63, 212, 242,  61,  66,  52
	 *    ]
	 * ```
	 */
	public async getStorageAt<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		storageSlot: Numbers,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getStorageAt(
			this,
			address,
			storageSlot,
			blockNumber,
			returnFormat,
		);
	}

	/**
	 * Get the code at a specific address.
	 *
	 * @param address The address to get the code from.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) Specifies what block to use as the current state for the code query.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The [data](https://ethereum.org/en/developers/docs/transactions/#the-data-field) at the provided `address`.
	 *
	 * ```ts
	 * web3.zond.getCode("0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234").then(console.log);
	 * > "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
	 *
	 * web3.zond.getCode(
	 *      "Z407d73d8a49eeb85d32cf465507dd71d507100c1",
	 *      undefined,
	 *      { number: FMT_NUMBER.HEX , bytes: FMT_BYTES.UINT8ARRAY }
	 * ).then(console.log);
	 * > Uint8Array(50) [
	 *   96,  1,  96,   0, 128, 53, 129, 26, 129, 129, 129,
	 *   20, 96,  18,  87, 131,  1,   0, 91,  96,  27,  96,
	 *   1, 53,  96,  37,  86, 91, 128, 96,   0,  82,  96,
	 *   32, 96,   0, 242,  91, 96,   0, 96,   7, 130,   2,
	 *   144, 80, 145, 144,  80, 86
	 * ]
	 * ```
	 */
	public async getCode<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getCode(this, address, blockNumber, returnFormat);
	}

	/**
	 * Retrieves a {@link Block} matching the provided block number, block hash or block tag.
	 *
	 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Zond.defaultBlock}) or block hash of the desired block.
	 * @param hydrated If specified `true`, the returned block will contain all transactions as objects. If `false` it will only contain transaction hashes.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted (does not format transaction objects or hashes).
	 * @returns A {@link Block} object matching the provided block number or block hash.
	 *
	 * ```ts
	 * web3.zond.getBlock(0).then(console.log);
	 * > {
	 *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
	 *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *    miner: 'Z0000000000000000000000000000000000000000',
	 *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
	 *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	 *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	 *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *    number: 0n,
	 *    gasLimit: 30000000n,
	 *    gasUsed: 0n,
	 *    timestamp: 1658281638n,
	 *    extraData: '0x',
	 *    prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *    baseFeePerGas: 1000000000n,
	 *    size: 514n,
	 *    transactions: []
	 *  }
	 *
	 * web3.zond.getBlock(
	 *      "0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d",
	 *      false,
	 *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * > {
	 *    hash: '0x7dbfdc6a7a67a670cb9b0c3f81ca60c007762f1e4e598cb027a470678ff26d0d',
	 *    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *    miner: 'Z0000000000000000000000000000000000000000',
	 *    stateRoot: '0x5ed9882897d363c4632a6e67fba6203df61bd994813dcf048da59be442a9c6c4',
	 *    transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	 *    receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
	 *    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *    number: 0,
	 *    gasLimit: 30000000,
	 *    gasUsed: 0,
	 *    timestamp: 1658281638,
	 *    extraData: '0x',
	 *    prevRandao: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *    baseFeePerGas: 1000000000,
	 *    size: 514,
	 *    transactions: []
	 *  }
	 * ```
	 */
	public async getBlock<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		hydrated = false,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlock(this, block, hydrated, returnFormat);
	}

	/**
	 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Zond.defaultBlock}) or block hash of the desired block.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The number of transactions in the provided block.
	 *
	 * ```ts
	 * web3.zond.getBlockTransactionCount("Z407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
	 * > 1n
	 *
	 * web3.zond.getBlockTransactionCount(
	 *     "Z407d73d8a49eeb85d32cf465507dd71d507100c1",
	 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * > 1
	 * ```
	 */
	public async getBlockTransactionCount<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getBlockTransactionCount(this, block, returnFormat);
	}

	/**
	 * @param transactionHash The hash of the desired transaction.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The desired transaction object.
	 *
	 * ```ts
	 * web3.zond.getTransaction('0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc').then(console.log);
	 * {
	 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
	 *    type: 2n,
	 *    nonce: 0n,
	 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
	 *    blockNumber: 1n,
	 *    transactionIndex: 0n,
	 *    from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *    to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *    value: 1n,
	 *    gas: 90000n,
	 *    maxFeePerGas: 2000000000n,
	 *    maxPriorityFeePerGas: 0n,
	 *    input: '0x',
	 *    publicKey: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
	 *    signature: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
	 *  }
	 *
	 * web3.zond.getTransaction(
	 *     web3.utils.hexToBytes("0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"),
	 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * {
	 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
	 *    type: 2,
	 *    nonce: 0,
	 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
	 *    blockNumber: 1,
	 *    transactionIndex: 0,
	 *    from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *    to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *    value: 1,
	 *    gas: 90000,
	 *    maxFeePerGas: 2000000000,
	 *    maxPriorityFeePerGas: 0,
	 *    input: '0x',
	 *    publicKey: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
	 *    signature: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
	 *  }
	 * ```
	 */
	public async getTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transactionHash: Bytes,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		const response = await rpcMethodsWrappers.getTransaction(
			this,
			transactionHash,
			returnFormat,
		);

		if (!response) throw new TransactionNotFound();

		return response;
	}

	/**
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns A list of pending transactions.
	 *
	 * ```ts
	 * web3.zond.getPendingTransactions().then(console.log);
	 * > [
	 *      {
	 *          hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
	 *          type: 2n,
	 *          nonce: 0n,
	 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *          blockNumber: null,
	 *          transactionIndex: 0n,
	 *          from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *          to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *          value: 1n,
	 *          gas: 90000n,
	 *          maxFeePerGas: 2000000000n,
	 *          maxPriorityFeePerGas: 0n,
	 *          input: '0x',
	 *          publicKey: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
	 *          signature: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
	 *      },
	 *      {
	 *          hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
	 *          type: 2n,
	 *          nonce: 1n,
	 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *          blockNumber: null,
	 *          transactionIndex: 0n,
	 *          from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *          to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *          value: 1n,
	 *          gas: 90000n,
	 *          maxFeePerGas: 2000000000n,
	 *          maxPriorityFeePerGas: 0n,
	 *          input: '0x',
	 *          publicKey: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
	 *          signature: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
	 *      }
	 *   ]
	 *
	 * * web3.zond.getPendingTransactions({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > [
	 *      {
	 *          hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
	 *          type: 2,
	 *          nonce: 0,
	 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *          blockNumber: null,
	 *          transactionIndex: 0,
	 *          from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *          to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *          value: 1,
	 *          gas: 90000,
	 *          maxFeePerGas: 2000000000,
	 *          maxPriorityFeePerGas: 0,
	 *          input: '0x',
	 *          publicKey: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
	 *          signature: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
	 *      },
	 *      {
	 *          hash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
	 *          type: 2,
	 *          nonce: 1,
	 *          blockHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
	 *          blockNumber: null,
	 *          transactionIndex: 0,
	 *          from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *          to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *          value: 1,
	 *          gas: 90000,
	 *          maxFeePerGas: 2000000000,
	 *			maxPriorityFeePerGas: 0,
	 *          input: '0x',
	 *          publicKey: '0x55ac19fade21db035a1b7ea0a8d49e265e05dbb926e75f273f836ad67ce5c96a',
	 *          signature: '0x6550036a7c3fd426d5c3d35d96a7075cd673957620b7889846a980d2d017ec08'
	 *      }
	 *   ]
	 * ```
	 */
	public async getPendingTransactions<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat) {
		return rpcMethodsWrappers.getPendingTransactions(this, returnFormat);
	}

	/**
	 * @param block The {@link BlockNumberOrTag} (defaults to {@link Web3Zond.defaultBlock}) or block hash of the desired block.
	 * @param transactionIndex The index position of the transaction.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The desired transaction object.
	 *
	 * ```ts
	 * web3.zond.getTransactionFromBlock('0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00', 0).then(console.log);
	 * {
	 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
	 *    type: 2n,
	 *    nonce: 0n,
	 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
	 *    blockNumber: 1n,
	 *    transactionIndex: 0n,
	 *    from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *    to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *    value: 1n,
	 *    gas: 90000n,
	 *    maxFeePerGas: 2000000000n,
	 *    maxPriorityFeePerGas: 0n,
	 *    input: '0x',
	 *    publicKey: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
	 *    signature: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
	 *  }
	 *
	 * web3.zond.getTransactionFromBlock(
	 *     hexToBytes("0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"),
	 *     0,
	 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * {
	 *    hash: '0x73aea70e969941f23f9d24103e91aa1f55c7964eb13daf1c9360c308a72686dc',
	 *    type: 2,
	 *    nonce: 0,
	 *    blockHash: '0x43202bd16b6bd54bea1b310736bd78bdbe93a64ad940f7586739d9eb25ad8d00',
	 *    blockNumber: 1,
	 *    transactionIndex: 0,
	 *    from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *    to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *    value: 1,
	 *    gas: 90000,
	 *    maxFeePerGas: 2000000000,
	 *    maxPriorityFeePerGas: 0,
	 *    input: '0x',
	 *    publicKey: '0x8b336c290f6d7b2af3ccb2c02203a8356cc7d5b150ab19cce549d55636a3a78c',
	 *    signature: '0x5a83c6f816befc5cd4b0c997a347224a8aa002e5799c4b082a3ec726d0e9531d'
	 *  }
	 * ```
	 */
	public async getTransactionFromBlock<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		block: HexString32Bytes | BlockNumberOrTag = this.defaultBlock,
		transactionIndex: Numbers,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getTransactionFromBlock(
			this,
			block,
			transactionIndex,
			returnFormat,
		);
	}

	/**
	 * @param transactionHash Hash of the transaction to retrieve the receipt for.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The desired {@link TransactionReceipt} object.
	 *
	 * ```ts
	 * web3.zond.getTransactionReceipt("0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f").then(console.log);
	 * > {
	 *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
	 *      transactionIndex: 0n,
	 *      blockNumber: 2n,
	 *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
	 *      from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *      to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *      cumulativeGasUsed: 21000n,
	 *      gasUsed: 21000n,
	 *      logs: [],
	 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *      status: 1n,
	 *      effectiveGasPrice: 2000000000n,
	 *      type: 2n
	 *  }
	 *
	 * web3.zond.getTransactionReceipt(
	 *      "0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f",
	 *      { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * > {
	 *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
	 *      transactionIndex: 0,
	 *      blockNumber: 2,
	 *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
	 *      from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *      to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *      cumulativeGasUsed: 21000,
	 *      gasUsed: 21000,
	 *      logs: [],
	 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *      status: 1,
	 *      effectiveGasPrice: 2000000000,
	 *      type: 2n
	 *  }
	 * ```
	 */
	public async getTransactionReceipt<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(transactionHash: Bytes, returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat) {
		const response = await rpcMethodsWrappers.getTransactionReceipt(
			this,
			transactionHash,
			returnFormat,
		);

		if (!response) throw new TransactionNotFound();

		return response;
	}

	/**
	 * @param address The address to get the number of transactions for.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) Specifies what block to use as the current state for the query.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The number of transactions sent from the provided address.
	 *
	 * ```ts
	 * web3.zond.getTransactionCount("Z407d73d8a49eeb85d32cf465507dd71d507100c1").then(console.log);
	 * > 1n
	 *
	 * web3.zond.getTransactionCount(
	 *     "Z407d73d8a49eeb85d32cf465507dd71d507100c1",
	 *     undefined,
	 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * > 1
	 * ```
	 */
	public async getTransactionCount<
		ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT,
	>(
		address: Address,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getTransactionCount(this, address, blockNumber, returnFormat);
	}

	/**
	 * @param transaction The {@link Transaction}, {@link TransactionWithFromLocalWalletIndex}, {@link TransactionWithToLocalWalletIndex} or {@link TransactionWithFromAndToLocalWalletIndex} to send. __Note:__ In the `to` and `from` fields when hex strings are used, it is assumed they are addresses, for any other form (number, string number, etc.) it is assumed they are wallet indexes.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @param options A configuration object used to change the behavior of the `sendTransaction` method.
	 * @returns If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
	 * ```ts
	 * const transaction = {
	 *   from: 'Z6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	 *   to: 'Z6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
	 *   value: '0x1'
	 * }
	 *
	 * const transactionHash = await web3.zond.sendTransaction(transaction);
	 * console.log(transactionHash);
	 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
	 *
	 * web3.zond.sendTransaction(transaction).then(console.log);
	 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
	 *
	 * web3.zond.sendTransaction(transaction).catch(console.log);
	 * > <Some TransactionError>
	 *
	 * // Example using options.ignoreGasPricing = true
	 * web3.zond.sendTransaction(transaction, undefined, { ignoreGasPricing: true }).then(console.log);
	 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
	 * ```
	 *
	 *
	 * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
	 * - `sending`
	 * ```ts
	 * web3.zond.sendTransaction(transaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
	 * > {
	 *    from: 'Z6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	 *    to: 'Z6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
	 *    value: '0x1',
	 *    maxFeePerGas: '0x77359400',
	 *    maxPriorityFeePerGas: '0x0'
	 * }
	 * ```
	 * - `sent`
	 * ```ts
	 * web3.zond.sendTransaction(transaction).on('sent', sentTransaction => console.log(sentTransaction));
	 * > {
	 *    from: 'Z6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	 *    to: 'Z6f1DF96865D09d21e8f3f9a7fbA3b17A11c7C53C',
	 *    value: '0x1',
	 *    maxFeePerGas: '0x77359400',
	 *    maxPriorityFeePerGas: '0x0'
	 * }
	 * ```
	 * - `transactionHash`
	 * ```ts
	 * web3.zond.sendTransaction(transaction).on('transactionHash', transactionHash => console.log(transactionHash));
	 * > 0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f
	 * ```
	 * - `receipt`
	 * ```ts
	 * web3.zond.sendTransaction(transaction).on('receipt', receipt => console.log(receipt));
	 * > {
	 *      transactionHash: '0xdf7756865c2056ce34c4eabe4eff42ad251a9f920a1c620c00b4ea0988731d3f',
	 *      transactionIndex: 0n,
	 *      blockNumber: 2n,
	 *      blockHash: '0xeb1565a08b23429552dafa92e32409f42eb43944f7611963c63ce40e7243941a',
	 *      from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *      to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *      cumulativeGasUsed: 21000n,
	 *      gasUsed: 21000n,
	 *      logs: [],
	 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *      status: 1n,
	 *      effectiveGasPrice: 2000000000n,
	 *      type: 2n
	 * }
	 * ```
	 * - `confirmation`
	 * ```ts
	 * web3.zond.sendTransaction(transaction).on('confirmation', confirmation => console.log(confirmation));
	 * > {
	 *     confirmations: 1n,
	 *     receipt: {
	 *         transactionHash: '0xb4a3a35ae0f3e77ef0ff7be42010d948d011b21a4e341072ee18717b67e99ab8',
	 *         transactionIndex: 0n,
	 *         blockNumber: 5n,
	 *         blockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548',
	 *         from: 'Z6e599da0bff7a6598ac1224e4985430bf16458a4',
	 *         to: 'Z6f1df96865d09d21e8f3f9a7fba3b17a11c7c53c',
	 *         cumulativeGasUsed: 21000n,
	 *         gasUsed: 21000n,
	 *         logs: [],
	 *         logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *         status: 1n,
	 *         effectiveGasPrice: 2000000000n,
	 *         type: 2n
	 *     },
	 *     latestBlockHash: '0xb57fbe6f145cefd86a305a9a024a4351d15d4d39607d7af53d69a319bc3b5548'
	 * }
	 * ```
	 * - `error`
	 * ```ts
	 * web3.zond.sendTransaction(transaction).on('error', error => console.log);
	 * > <Some TransactionError>
	 * ```
	 */
	public sendTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction:
			| Transaction
			| TransactionWithFromLocalWalletIndex
			| TransactionWithToLocalWalletIndex
			| TransactionWithFromAndToLocalWalletIndex,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
		options?: SendTransactionOptions,
	) {
		return rpcMethodsWrappers.sendTransaction(this, transaction, returnFormat, options);
	}

	/**
	 * @param transaction Signed transaction in one of the valid {@link Bytes} format.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns If `await`ed or `.then`d (i.e. the promise resolves), the transaction hash is returned.
	 * ```ts
	 * const signedTransaction = "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
	 *
	 * const transactionHash = await web3.zond.sendSignedTransaction(signedTransaction);
	 * console.log(transactionHash);
	 * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
	 *
	 * web3.zond.sendSignedTransaction(signedTransaction).then(console.log);
	 * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
	 *
	 * web3.zond.sendSignedTransaction(signedTransaction).catch(console.log);
	 * > <Some TransactionError>
	 * ```
	 *
	 *
	 * Otherwise, a {@link Web3PromiEvent} is returned which has several events than can be listened to using the `.on` syntax, such as:
	 * - `sending`
	 * ```ts
	 * web3.zond.sendSignedTransaction(signedTransaction).on('sending', transactionToBeSent => console.log(transactionToBeSent));
	 * > "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
	 * ```
	 * - `sent`
	 * ```ts
	 * web3.zond.sendSignedTransaction(signedTransaction).on('sent', sentTransaction => console.log(sentTransaction));
	 * > "0xf86580843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a95a03a42d53ca5b71f845e1cd4c65359b05446a85d16881372d3bfaab8980935cb04a0711497bc8dd3b541152e2fed14fe650a647f1f0edab0d386ad9506f0e642410f"
	 * ```
	 * - `transactionHash`
	 * ```ts
	 * web3.zond.sendSignedTransaction(signedTransaction).on('transactionHash', transactionHash => console.log(transactionHash));
	 * > 0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700
	 * ```
	 * - `receipt`
	 * ```ts
	 * web3.zond.sendSignedTransaction(signedTransaction).on('receipt', receipt => console.log(receipt));
	 * > {
	 *      blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
	 *      blockNumber: 1n,
	 *      cumulativeGasUsed: 21000n,
	 *      effectiveGasPrice: 1000000001n,
	 *      from: 'Ze899f0130fd099c0b896b2ce4e5e15a25b23139a',
	 *      gasUsed: 21000n,
	 *      logs: [],
	 *      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *      status: 1n,
	 *      to: 'Ze899f0130fd099c0b896b2ce4e5e15a25b23139a',
	 *      transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
	 *      transactionIndex: 0n,
	 *      type: 2n
	 * }
	 * ```
	 * - `confirmation`
	 * ```ts
	 * web3.zond.sendSignedTransaction(signedTransaction).on('confirmation', confirmation => console.log(confirmation));
	 * > {
	 *     confirmations: 1n,
	 *     receipt: {
	 *          blockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081',
	 *          blockNumber: 1n,
	 *          cumulativeGasUsed: 21000n,
	 *          effectiveGasPrice: 1000000001n,
	 *          from: 'Ze899f0130fd099c0b896b2ce4e5e15a25b23139a',
	 *          gasUsed: 21000n,
	 *          logs: [],
	 *          logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	 *          status: 1n,
	 *          to: 'Ze899f0130fd099c0b896b2ce4e5e15a25b23139a',
	 *          transactionHash: '0xed8c241ea44d57f4605dc22c63500de46254d6c7844fd65fa438b128c80cf700',
	 *          transactionIndex: 0n,
	 *          type: 2n
	 *     },
	 *     latestBlockHash: '0xff2b1687995d81066361bc6affe4455746120a7d4bb75fc938211a2692a50081'
	 * }
	 * ```
	 * - `error`
	 * ```ts
	 * web3.zond.sendSignedTransaction(signedTransaction).on('error', error => console.log(error));
	 * > <Some TransactionError>
	 * ```
	 */
	public sendSignedTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Bytes,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
		options?: SendTransactionOptions,
	) {
		return rpcMethodsWrappers.sendSignedTransaction(this, transaction, returnFormat, options);
	}

	/**
	 * @param message Data to sign in one of the valid {@link Bytes} format.
	 * @param address Address to sign data with, can be an address or the index of a local wallet.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns The signed `message`.
	 *
	 * ```ts
	 * // Using an unlocked account managed by connected RPC client
	 * web3.zond.sign("0x48656c6c6f20776f726c64", "Z11f4d0A3c12e86B4b5F39B213F7E19D048276DAe").then(console.log);
	 * > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
	 *
	 * // Using an unlocked account managed by connected RPC client
	 * web3.zond.sign("0x48656c6c6f20776f726c64", "Z11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.UINT8ARRAY }).then(console.log);
	 * > Uint8Array(65) [
	 *    48, 117,  94, 214,  83, 150, 250, 207, 134, 197,  62,
	 *    98,  23, 197,  43,  77, 174, 190, 114, 170,  73,  65,
	 *   216, 150,  53,  64, 157, 228, 201, 199, 249,  70, 109,
	 *    78, 154, 174, 199, 151, 127,   5, 233,  35, 136, 155,
	 *    51, 192, 208, 221,  39, 215,  34, 107, 110, 111,  86,
	 *   206, 115, 116, 101, 197, 207, 208,  75, 228,   0
	 * ]
	 * ```
	 *
	 * // Using an indexed account managed by local Web3 wallet
	 * web3.zond.sign("0x48656c6c6f20776f726c64", 0).then(console.log);
	 * > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
	 */
	public async sign<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		message: Bytes,
		address: Address,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.sign(this, message, address, returnFormat);
	}

	/**
	 * @param transaction The transaction object to sign.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) Specifies how the return data should be formatted.
	 * @returns {@link SignedTransactionInfoAPI}, an object containing the [RLP](https://ethereum.org/en/developers/docs/data-structures-and-encoding/rlp/#top) encoded signed transaction (accessed via the `raw` property) and the signed transaction object (accessed via the `tx` property).
	 *
	 * ```ts
	 * const transaction = {
	 *      from: 'Ze899f0130FD099c0b896B2cE4E5E15A25b23139a',
	 *      to: 'Ze899f0130FD099c0b896B2cE4E5E15A25b23139a',
	 *      value: '0x1',
	 *      gas: '21000',
	 *      maxFeePerGas: '1000000001',
	 *      maxPriorityFeePerGas: '0',
	 *      nonce: '0x1',
	 *      type: '0x2'
	 * }
	 *
	 * web3.zond.signTransaction(transaction).then(console.log);
	 * > {
	 *   raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
	 *   tx: {
	 *      type: 2n,
	 *      nonce: 1n,
	 *      maxFeePerGas: 1000000001n,
	 *      maxPriorityFeePerGas: 0n,
	 *      gas: 21000n,
	 *      value: 1n,
	 *      publicKey: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
	 *      signature: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
	 *      to: 'Ze899f0130fd099c0b896b2ce4e5e15a25b23139a',
	 *      data: '0x'
	 *   }
	 * }
	 *
	 * web3.zond.signTransaction(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > {
	 *   raw: '0xf86501843b9aca0182520894e899f0130fd099c0b896b2ce4e5e15a25b23139a0180820a96a0adb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679a027d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
	 *   tx: {
	 *      type: 2,
	 *      nonce: 1,
	 *      maxFeePerGas: 1000000001,
	 * 	    maxPriorityFeePerGas: 0,
	 *      gas: 21000,
	 *      value: 1,
	 *      publicKey: '0xadb3468dbb4dce89fe1785ea9182e85fb56b399b378f82b93af7a8a12a4f9679',
	 *      signature: '0x27d37d736e9bcf00121f78b2d10e4404fa5c45856d62b746574345f5cd278097',
	 *      to: 'Ze899f0130fd099c0b896b2ce4e5e15a25b23139a',
	 *      data: '0x'
	 *   }
	 * }
	 * ```
	 */
	public async signTransaction<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Transaction,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.signTransaction(this, transaction, returnFormat);
	}

	// TODO Decide what to do with transaction.to
	// https://github.com/theqrl/web3.js/pull/4525#issuecomment-982330076
	/**
	 * Executes a message call within the ZVM without creating a transaction.
	 * It does not publish anything to the blockchain and does not consume any gas.
	 *
	 * @param transaction - A transaction object where all properties are optional except `to`, however it's recommended to include the `from` property or it may default to `Z0000000000000000000000000000000000000000` depending on your node or provider.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the transaction.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns The returned data of the call, e.g. a smart contract function's return value.
	 */
	public async call<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: TransactionCall,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.call(this, transaction, blockNumber, returnFormat);
	}

	/**
	 * Simulates the transaction within the ZVM to estimate the amount of gas to be used by the transaction.
	 * The transaction will not be added to the blockchain, and actual gas usage can vary when interacting
	 * with a contract as a result of updating the contract's state.
	 *
	 * @param transaction The {@link Transaction} object to estimate the gas for.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the gas estimation.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns The used gas for the simulated transaction execution.
	 *
	 * ```ts
	 * const transaction = {
	 *       from: 'Ze899f0130FD099c0b896B2cE4E5E15A25b23139a',
	 *       to: 'Ze899f0130FD099c0b896B2cE4E5E15A25b23139a',
	 *       value: '0x1',
	 *       nonce: '0x1',
	 *       type: '0x2'
	 * }
	 *
	 * web3.zond.estimateGas(transaction).then(console.log);
	 * > 21000n
	 *
	 * web3.zond.estimateGas(transaction, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > 21000
	 * ```
	 */
	public async estimateGas<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: Transaction,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.estimateGas(this, transaction, blockNumber, returnFormat);
	}

	/**
	 * Gets past logs, matching the provided `filter`.
	 *
	 * @param filter A {@link Filter} object containing the properties for the desired logs.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns {@link FilterResultsAPI}, an array of {@link Log} objects.
	 *
	 * ```ts
	 * web3.zond.getPastLogs({
	 *      address: "Z11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
	 *      topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
	 *  }).then(console.log);
	 * > [{
	 *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
	 *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
	 *       logIndex: 0n,
	 *       transactionIndex: 0n,
	 *       transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
	 *       blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
	 *       blockNumber: 1234n,
	 *       address: 'Zde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
	 *   },
	 *   {...}]
	 *
	 * web3.zond.getPastLogs(
	 *     {
	 *       address: "Z11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
	 *       topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
	 *     },
	 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * > [{
	 *       data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
	 *       topics: ['0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7', '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385']
	 *       logIndex: 0,
	 *       transactionIndex: 0,
	 *       transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
	 *       blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
	 *       blockNumber: 1234,
	 *       address: 'Zde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
	 *   },
	 *   {...}]
	 * ```
	 */
	public async getPastLogs<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		filter: Filter,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getLogs(this, filter, returnFormat);
	}

	/**
	 * This method will request/enable the accounts from the current environment and for supporting [EIP 1102](https://eips.ethereum.org/EIPS/eip-1102)
	 * This method will only work if you’re using the injected provider from a application like Metamask, Status or TrustWallet.
	 * It doesn’t work if you’re connected to a node with a default Web3.js provider (WebsocketProvider, HttpProvider and IpcProvider).
	 * For more information about the behavior of this method please read [EIP-1102](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md): Opt-in account exposure.
	 *
	 * @returns An array of enabled accounts.
	 *
	 * ```ts
	 * web3.zond.requestAccounts().then(console.log);
	 * > ['Zae0B295369a9FD31d5F28D9Ec85E40f4cb692BAf', 'Zde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']
	 * ```
	 */
	public async requestAccounts() {
		return zondRpcMethods.requestAccounts(this.requestManager);
	}

	/**
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns The chain ID of the current connected node as described in the [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md).
	 *
	 * ```ts
	 * web3.zond.getChainId().then(console.log);
	 * > 61n
	 *
	 * web3.zond.getChainId({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > 61
	 * ```
	 */
	public async getChainId<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getChainId(this, returnFormat);
	}

	/**
	 * @returns The current client version.
	 *
	 * ```ts
	 * web3.zond.getNodeInfo().then(console.log);
	 * > "Mist/v0.9.3/darwin/go1.4.1"
	 * ```
	 */
	public async getNodeInfo() {
		return zondRpcMethods.getNodeInfo(this.requestManager);
	}

	/**
	 * @param address The Address of the account or contract.
	 * @param storageKeys Array of storage-keys which should be proofed and included. See {@link web3.getStorageAt}.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the gas estimation.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns The account and storage-values of the specified account including the Merkle-proof as described in [EIP-1186](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1186.md).
	 *
	 * ```ts
	 * web3.zond.getProof(
	 *     "Z1234567890123456789012345678901234567890",
	 *     ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
	 *     "latest"
	 * ).then(console.log);
	 * > {
	 *     "address": "Z1234567890123456789012345678901234567890",
	 *     "accountProof": [
	 *         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
	 *         "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
	 *         "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
	 *         "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
	 *     ],
	 *     "balance": 0n,
	 *     "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
	 *     "nonce": 0n,
	 *     "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
	 *     "storageProof": [
	 *         {
	 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
	 *             "value": 0n,
	 *             "proof": []
	 *         },
	 *         {
	 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
	 *             "value": 0n,
	 *             "proof": []
	 *         }
	 *     ]
	 * }
	 *
	 * web3.zond.getProof(
	 *     "Z1234567890123456789012345678901234567890",
	 *     ["0x0000000000000000000000000000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000000000000000000000000001"],
	 *     undefined,
	 *     { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }
	 * ).then(console.log);
	 * > {
	 *     "address": "Z1234567890123456789012345678901234567890",
	 *     "accountProof": [
	 *         "0xf90211a090dcaf88c40c7bbc95a912cbdde67c175767b31173df9ee4b0d733bfdd511c43a0babe369f6b12092f49181ae04ca173fb68d1a5456f18d20fa32cba73954052bda0473ecf8a7e36a829e75039a3b055e51b8332cbf03324ab4af2066bbd6fbf0021a0bbda34753d7aa6c38e603f360244e8f59611921d9e1f128372fec0d586d4f9e0a04e44caecff45c9891f74f6a2156735886eedf6f1a733628ebc802ec79d844648a0a5f3f2f7542148c973977c8a1e154c4300fec92f755f7846f1b734d3ab1d90e7a0e823850f50bf72baae9d1733a36a444ab65d0a6faaba404f0583ce0ca4dad92da0f7a00cbe7d4b30b11faea3ae61b7f1f2b315b61d9f6bd68bfe587ad0eeceb721a07117ef9fc932f1a88e908eaead8565c19b5645dc9e5b1b6e841c5edbdfd71681a069eb2de283f32c11f859d7bcf93da23990d3e662935ed4d6b39ce3673ec84472a0203d26456312bbc4da5cd293b75b840fc5045e493d6f904d180823ec22bfed8ea09287b5c21f2254af4e64fca76acc5cd87399c7f1ede818db4326c98ce2dc2208a06fc2d754e304c48ce6a517753c62b1a9c1d5925b89707486d7fc08919e0a94eca07b1c54f15e299bd58bdfef9741538c7828b5d7d11a489f9c20d052b3471df475a051f9dd3739a927c89e357580a4c97b40234aa01ed3d5e0390dc982a7975880a0a089d613f26159af43616fd9455bb461f4869bfede26f2130835ed067a8b967bfb80",
	 *         "0xf90211a0395d87a95873cd98c21cf1df9421af03f7247880a2554e20738eec2c7507a494a0bcf6546339a1e7e14eb8fb572a968d217d2a0d1f3bc4257b22ef5333e9e4433ca012ae12498af8b2752c99efce07f3feef8ec910493be749acd63822c3558e6671a0dbf51303afdc36fc0c2d68a9bb05dab4f4917e7531e4a37ab0a153472d1b86e2a0ae90b50f067d9a2244e3d975233c0a0558c39ee152969f6678790abf773a9621a01d65cd682cc1be7c5e38d8da5c942e0a73eeaef10f387340a40a106699d494c3a06163b53d956c55544390c13634ea9aa75309f4fd866f312586942daf0f60fb37a058a52c1e858b1382a8893eb9c1f111f266eb9e21e6137aff0dddea243a567000a037b4b100761e02de63ea5f1fcfcf43e81a372dafb4419d126342136d329b7a7ba032472415864b08f808ba4374092003c8d7c40a9f7f9fe9cc8291f62538e1cc14a074e238ff5ec96b810364515551344100138916594d6af966170ff326a092fab0a0d31ac4eef14a79845200a496662e92186ca8b55e29ed0f9f59dbc6b521b116fea090607784fe738458b63c1942bba7c0321ae77e18df4961b2bc66727ea996464ea078f757653c1b63f72aff3dcc3f2a2e4c8cb4a9d36d1117c742833c84e20de994a0f78407de07f4b4cb4f899dfb95eedeb4049aeb5fc1635d65cf2f2f4dfd25d1d7a0862037513ba9d45354dd3e36264aceb2b862ac79d2050f14c95657e43a51b85c80",
	 *         "0xf90171a04ad705ea7bf04339fa36b124fa221379bd5a38ffe9a6112cb2d94be3a437b879a08e45b5f72e8149c01efcb71429841d6a8879d4bbe27335604a5bff8dfdf85dcea00313d9b2f7c03733d6549ea3b810e5262ed844ea12f70993d87d3e0f04e3979ea0b59e3cdd6750fa8b15164612a5cb6567cdfb386d4e0137fccee5f35ab55d0efda0fe6db56e42f2057a071c980a778d9a0b61038f269dd74a0e90155b3f40f14364a08538587f2378a0849f9608942cf481da4120c360f8391bbcc225d811823c6432a026eac94e755534e16f9552e73025d6d9c30d1d7682a4cb5bd7741ddabfd48c50a041557da9a74ca68da793e743e81e2029b2835e1cc16e9e25bd0c1e89d4ccad6980a041dda0a40a21ade3a20fcd1a4abb2a42b74e9a32b02424ff8db4ea708a5e0fb9a09aaf8326a51f613607a8685f57458329b41e938bb761131a5747e066b81a0a16808080a022e6cef138e16d2272ef58434ddf49260dc1de1f8ad6dfca3da5d2a92aaaadc58080",
	 *         "0xf851808080a009833150c367df138f1538689984b8a84fc55692d3d41fe4d1e5720ff5483a6980808080808080808080a0a319c1c415b271afc0adcb664e67738d103ac168e0bc0b7bd2da7966165cb9518080"
	 *     ],
	 *     "balance": 0,
	 *     "codeHash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
	 *     "nonce": 0,
	 *     "storageHash": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
	 *     "storageProof": [
	 *         {
	 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
	 *             "value": 0,
	 *             "proof": []
	 *         },
	 *         {
	 *             "key": "0x0000000000000000000000000000000000000000000000000000000000000001",
	 *             "value": 0,
	 *             "proof": []
	 *         }
	 *     ]
	 * }
	 * ```
	 */
	public async getProof<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		storageKeys: Bytes[],
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getProof(this, address, storageKeys, blockNumber, returnFormat);
	}

	// TODO Throwing an error with Gzond, but not Infura
	// TODO gasUsedRatio and reward not formatting
	/**
	 * @param blockCount Number of blocks in the requested range. Between `1` and `1024` blocks can be requested in a single query. Less than requested may be returned if not all blocks are available.
	 * @param newestBlock Highest number block of the requested range.
	 * @param rewardPercentiles A monotonically increasing list of percentile values to sample from each block’s effective priority fees per gas in ascending order, weighted by gas used. Example: `['0', '25', '50', '75', '100']` or `['0', '0.5', '1', '1.5', '3', '80']`
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the call should be formatted.
	 * @returns `baseFeePerGas` and transaction effective `priorityFeePerGas` history for the requested block range if available.
	 * The range between `headBlock - 4` and `headBlock` is guaranteed to be available while retrieving data from the `pending` block and older history are optional to support.
	 *
	 * ```ts
	 * web3.zond.getFeeHistory(4, 'pending', [0, 25, 75, 100]).then(console.log);
	 * > {
	 *     baseFeePerGas: [
	 *         22983878621n,
	 *         21417903463n,
	 *         19989260230n,
	 *         17770954829n,
	 *         18850641304n
	 *     ],
	 *     gasUsedRatio: [
	 *         0.22746546666666667,
	 *         0.2331871,
	 *         0.05610054885262125,
	 *         0.7430227268212117
	 *     ],
	 *     oldestBlock: 15216343n,
	 *     reward: [
	 *         [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
	 *         [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
	 *         [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
	 *         [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
	 *     ]
	 * }
	 *
	 * web3.zond.getFeeHistory(4, BlockTags.LATEST, [0, 25, 75, 100], { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX }).then(console.log);
	 * > {
	 *     baseFeePerGas: [
	 *         22983878621,
	 *         21417903463,
	 *         19989260230,
	 *         17770954829,
	 *         18850641304
	 *     ],
	 *     gasUsedRatio: [
	 *         0.22746546666666667,
	 *         0.2331871,
	 *         0.05610054885262125,
	 *         0.7430227268212117
	 *     ],
	 *     oldestBlock: 15216343,
	 *     reward: [
	 *         [ '0x3b9aca00', '0x53724e00', '0x77359400', '0x1d92c03423' ],
	 *         [ '0x3b9aca00', '0x3b9aca00', '0x3b9aca00', '0xee6b2800' ],
	 *         [ '0x3b9aca00', '0x4f86a721', '0x77d9743a', '0x9502f900' ],
	 *         [ '0xcc8ff9e', '0x53724e00', '0x77359400', '0x1ec9771bb3' ]
	 *     ]
	 * }
	 * ```
	 */
	public async getFeeHistory<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		blockCount: Numbers,
		newestBlock: BlockNumberOrTag = this.defaultBlock,
		rewardPercentiles: Numbers[],
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.getFeeHistory(
			this,
			blockCount,
			newestBlock,
			rewardPercentiles,
			returnFormat,
		);
	}

	/**
	 * This method generates an access list for a transaction.
	 *
	 * @param transaction - A transaction object where all properties are optional except `from`, however it's recommended to include the `to` property.
	 * @param blockNumber ({@link BlockNumberOrTag} defaults to {@link Web3Zond.defaultBlock}) - Specifies what block to use as the current state of the blockchain while processing the transaction.
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the return data from the createAccessList should be formatted.
	 * @returns The returned data of the createAccessList,  e.g. The generated access list for transaction.
	 * @example
	 * ```ts
	 * web3.zond.createAccessList({
	 * from: 'ZDe95305a63302C3aa4d3A9B42654659AeA72b694',
	 * data: '0x9a67c8b100000000000000000000000000000000000000000000000000000000000004d0',
	 * maxFeePerGas: '0x3b9aca00',
	 * maxPriorityFeePerGas: '0x0',
	 * gas: '0x3d0900',
	 * to: 'Z940b25304947ae863568B3804434EC77E2160b87'
	 * })
	 * .then(console.log);
	 *
	 * > {
	 *  "accessList": [
	 *     {
	 *       "address": "Z15859bdf5aff2080a9968f6a410361e9598df62f",
	 *       "storageKeys": [
	 *         "0x0000000000000000000000000000000000000000000000000000000000000000"
	 *       ]
	 *     }
	 *   ],
	 *   "gasUsed": "0x7671"
	 * }
	 * ```
	 */
	public async createAccessList<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		transaction: TransactionForAccessList,
		blockNumber: BlockNumberOrTag = this.defaultBlock,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.createAccessList(this, transaction, blockNumber, returnFormat);
	}

	/**
	 * This method sends EIP-712 typed data to the RPC provider to be signed.
	 *
	 * @param address The address that corresponds with the private key used to sign the typed data.
	 * @param typedData The EIP-712 typed data object.
	 * @param useLegacy A boolean flag determining whether the RPC call uses the legacy method `zond_signTypedData` or the newer method `zond_signTypedData_v4`
	 * @param returnFormat ({@link DataFormat} defaults to {@link DEFAULT_RETURN_FORMAT}) - Specifies how the signed typed data should be formatted.
	 * @returns The signed typed data.
	 */
	public async signTypedData<ReturnFormat extends DataFormat = typeof DEFAULT_RETURN_FORMAT>(
		address: Address,
		typedData: Eip712TypedData,
		useLegacy = false,
		returnFormat: ReturnFormat = DEFAULT_RETURN_FORMAT as ReturnFormat,
	) {
		return rpcMethodsWrappers.signTypedData(this, address, typedData, useLegacy, returnFormat);
	}

	/**
	 * Lets you subscribe to specific events in the blockchain.
	 *
	 * @param name - The subscription you want to subscribe to.
	 * @param args - Optional additional parameters, depending on the subscription type.
	 * @returns A subscription object of type {@link RegisteredSubscription}. The object contains:
	 *  - subscription.id: The subscription id, used to identify and unsubscribing the subscription.
	 *  - subscription.subscribe(): Can be used to re-subscribe with the same parameters.
	 *  - subscription.unsubscribe(): Unsubscribes the subscription and returns TRUE in the callback if successful.
	 *  - subscription.args: The subscription arguments, used when re-subscribing.
	 *
	 *
	 * You can use the subscription object to listen on:
	 *
	 * - on("data") - Fires on each incoming log with the log object as argument.
	 * - on("changed") - Fires on each log which was removed from the blockchain. The log will have the additional property "removed: true".
	 * - on("error") - Fires when an error in the subscription occurs.
	 * - on("connected") - Fires once after the subscription successfully connected. Returns the subscription id.
	 *
	 * @example **Subscribe to Smart Contract events**
	 * ```ts
	 * // Subscribe to `logs`
	 * const logSubscription = web3.zond.subscribe('logs', {
	 *     address: 'Z1234567890123456789012345678901234567890',
	 *     topics: ['0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234']
	 * });
	 * logSubscription.on('data', (data: any) => console.log(data));
	 * logSubscription.on('error', (error: any) => console.log(error));
	 *
	 * ```
	 *
	 * @example **Subscribe to new block headers**
	 * ```ts
	 * // Subscribe to `newBlockHeaders`
	 * const newBlocksSubscription = await web3.zond.subscribe('newBlockHeaders');
	 *
	 * newBlocksSubscription.on('data', async blockhead => {
	 * 	console.log('New block header: ', blockhead);
	 *
	 * 	// You do not need the next line, if you like to keep notified for every new block
	 * 	await newBlocksSubscription.unsubscribe();
	 * 	console.log('Unsubscribed from new block headers.');
	 * });
	 * newBlocksSubscription.on('error', error =>
	 * 	console.log('Error when subscribing to New block header: ', error),
	 * );
	 * ```
	 */
	public async subscribe<
		T extends keyof RegisteredSubscription,
		ReturnType extends DataFormat = DataFormat,
	>(
		name: T,
		args?: ConstructorParameters<RegisteredSubscription[T]>[0],
		returnFormat: ReturnType = DEFAULT_RETURN_FORMAT as ReturnType,
	): Promise<InstanceType<RegisteredSubscription[T]>> {
		const subscription = await this.subscriptionManager?.subscribe(name, args, returnFormat);
		if (
			subscription instanceof LogsSubscription &&
			name === 'logs' &&
			typeof args === 'object' &&
			!isNullish(args.fromBlock) &&
			Number.isFinite(Number(args.fromBlock))
		) {
			setImmediate(() => {
				this.getPastLogs(args)
					.then(logs => {
						for (const log of logs) {
							subscription._processSubscriptionResult(log as LogsOutput);
						}
					})
					.catch(e => {
						subscription._processSubscriptionError(e as Error);
					});
			});
		}
		return subscription;
	}

	private static shouldClearSubscription({ sub }: { sub: unknown }): boolean {
		return !(sub instanceof SyncingSubscription);
	}

	/**
	 * Resets subscriptions.
	 *
	 * @param notClearSyncing If `true` it keeps the `syncing` subscription.
	 * @returns A promise to an array of subscription ids that were cleared.
	 *
	 * ```ts
	 * web3.zond.clearSubscriptions().then(console.log);
	 * > [...] An array of subscription ids that were cleared
	 * ```
	 */
	public clearSubscriptions(notClearSyncing = false): Promise<string[]> | undefined {
		return this.subscriptionManager?.unsubscribe(
			// eslint-disable-next-line
			notClearSyncing ? Web3Zond.shouldClearSubscription : undefined,
		);
	}
}
