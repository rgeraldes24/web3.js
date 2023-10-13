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

import { EthExecutionAPI, Bytes, Transaction, /*KeyStore,*/ ETH_DATA_FORMAT } from '@theqrl/web3-types';
import { format } from 'web3-utils';
import { Web3Context } from 'web3-core';
import { prepareTransactionForSigning } from 'web3-eth';
import {
	create,
	//decrypt,
	//encrypt,
	hashMessage,
	//recover,
	recoverTransaction,
	signTransaction,
	sign,
	Wallet,
	seedToAccount,
} from 'web3-eth-accounts';

/**
 * Initialize the accounts module for the given context.
 *
 * To avoid multiple package dependencies for `web3-eth-accounts` we are creating
 * this function in `web3` package. In future the actual `web3-eth-accounts` package
 * should be converted to context aware.
 */
export const initAccountsForContext = (context: Web3Context<EthExecutionAPI>) => {
	const signTransactionWithContext = async (transaction: Transaction, privateKey: Bytes, publicKey: Bytes) => {
		const tx = await prepareTransactionForSigning(transaction, context);

		const privateKeyBytes = format({ format: 'bytes' }, privateKey, ETH_DATA_FORMAT);
		const publicKeyBytes = format({ format: 'bytes' }, publicKey, ETH_DATA_FORMAT);

		return signTransaction(tx, privateKeyBytes, publicKeyBytes);
	};

	const seedToAccountWithContext = (seed: Uint8Array | string) => {
		// TODO(rgeraldes24) - review seed to account parameter type
		const account = seedToAccount(seed);

		return {
			...account,
			signTransaction: async (transaction: Transaction) =>
				signTransactionWithContext(transaction, account.privateKey, account.publicKey),
		};
	};

	// const decryptWithContext = async (
	// 	keystore: KeyStore | string,
	// 	password: string,
	// 	options?: Record<string, unknown>,
	// ) => {
	// 	const account = await decrypt(keystore, password, (options?.nonStrict as boolean) ?? true);

	// 	return {
	// 		...account,
	// 		signTransaction: async (transaction: Transaction) =>
	// 			signTransactionWithContext(transaction, account.privateKey),
	// 	};
	// };

	const createWithContext = () => {
		const account = create();

		return {
			...account,
			signTransaction: async (transaction: Transaction) =>
				signTransactionWithContext(transaction, account.privateKey, account.publicKey),
		};
	};

	const wallet = new Wallet({
		create: createWithContext,
		seedToAccount: seedToAccountWithContext,
		//decrypt: decryptWithContext,
	});

	return {
		signTransaction: signTransactionWithContext,
		create: createWithContext,
		seedToAccount: seedToAccountWithContext,
		//decrypt: decryptWithContext,
		recoverTransaction,
		hashMessage,
		sign,
		//recover,
		//encrypt,
		wallet,
	};
};
