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

import { Address } from '@theqrl/web3-types';
import { Web3ValidatorError, isAddressString } from '@theqrl/web3-validator';
import {
	create,
	decrypt,
	encrypt,
	hashMessage,
	seedToAccount,
	publicKeyToAddress,
	recoverTransaction,
	sign,
	signTransaction,
} from '../../src/account';
import {
	invalidDecryptData,
	invalidEncryptData,
	invalidKeyStore,
	invalidSeedtoAccountData,
	invalidPublicKeyToAddressData,
	signatureRecoverData,
	transactionsTestData,
	validDecryptData,
	validEncryptData,
	validHashMessageData,
	validSeedtoAccountData,
	validPublicKeyToAddressData,
} from '../fixtures/account';
import { TransactionFactory } from '../../src/tx/transactionFactory';
import { TxData } from '../../src/tx/types';

describe('accounts', () => {
	describe('create', () => {
		describe('valid cases', () => {
			it('%s', () => {
				const account = create();
				expect(typeof account.seed).toBe('string');
				expect(typeof account.address).toBe('string');
				expect(isAddressString(account.address)).toBe(true);
				expect(typeof account.encrypt).toBe('function');
				expect(typeof account.sign).toBe('function');
				expect(typeof account.signTransaction).toBe('function');
			});
		});
	});

	describe('publicKeyToAddress', () => {
		describe('valid cases', () => {
			it.each(validPublicKeyToAddressData)('%s', (input, output) => {
				expect(publicKeyToAddress(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(invalidPublicKeyToAddressData)('%s', (input, output) => {
				expect(() => publicKeyToAddress(input)).toThrow(output);
			});
		});
	});

	describe('seedToAccount', () => {
		describe('valid cases', () => {
			it.each(validSeedtoAccountData)('%s', (input, output) => {
				expect(JSON.stringify(seedToAccount(input.address, input.ignoreLength))).toEqual(
					JSON.stringify(output),
				);
			});
		});

		describe('invalid cases', () => {
			it.each(invalidSeedtoAccountData)('%s', (input, output) => {
				expect(() => seedToAccount(input)).toThrow(output);
			});
		});
	});

	describe('Signing and Recovery of Transaction', () => {
		it.each(transactionsTestData)('sign transaction', async txData => {
			const account = create();

			const signedResult = await signTransaction(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				TransactionFactory.fromTxData(txData as unknown as TxData),
				account.seed,
			);
			expect(signedResult).toBeDefined();
			expect(signedResult.messageHash).toBeDefined();
			expect(signedResult.rawTransaction).toBeDefined();
			expect(signedResult.transactionHash).toBeDefined();
			expect(signedResult.signature).toMatch(/0[xX][0-9a-fA-F]{9190}/);
		});

		it.each(transactionsTestData)('Recover transaction', async txData => {
			const account = create();
			const txObj = { ...txData, from: account.address };
			const signedResult = await signTransaction(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				TransactionFactory.fromTxData(txObj),
				account.seed,
			);
			expect(signedResult).toBeDefined();

			const address: Address = recoverTransaction(signedResult.rawTransaction);
			expect(address).toBeDefined();
			expect(address).toEqual(account.address);
		});
	});

	describe('Hash Message', () => {
		it.each(validHashMessageData)('%s', (message, hash) => {
			expect(hashMessage(message)).toEqual(hash);
		});
	});

	describe('Sign Message', () => {
		describe('sign', () => {
			it.each(signatureRecoverData)('%s', (data, testObj) => {
				const result = sign(data, testObj.seed);
				expect(result.signature).toEqual(testObj.signature);
			});
		});
	});

	describe('encrypt', () => {
		describe('valid cases', () => {
			it.each(validEncryptData)('%s', async (input, output) => {
				const result = await encrypt(input[0], input[1], input[2]).catch(err => {
					throw err;
				});
				expect(result.version).toBe(output.version);
				expect(result.address).toBe(output.address);
				expect(result.crypto.ciphertext).toBe(output.crypto.ciphertext);
				expect(result.crypto.cipherparams).toEqual(output.crypto.cipherparams);
				expect(result.crypto.cipher).toEqual(output.crypto.cipher);
				expect(result.crypto.kdf).toBe(output.crypto.kdf);
				expect(result.crypto.kdfparams).toEqual(output.crypto.kdfparams);
				expect(typeof result.version).toBe('number');
				expect(typeof result.id).toBe('string');
			});
		});

		describe('invalid cases', () => {
			it.each(invalidEncryptData)('%s', async (input, output) => {
				const result = encrypt(input[0], input[1], input[2]);
				await expect(result).rejects.toThrow(output);
			});
		});
	});

	describe('decrypt', () => {
		describe('valid cases', () => {
			it.each(validDecryptData)('%s', async input => {
				const keystore = await encrypt(input[0], input[1], input[2]).catch(err => {
					throw err;
				});

				// make sure decrypt does not throw invalid password error
				const result = await decrypt(keystore, input[1]);

				expect(JSON.stringify(result)).toEqual(
					JSON.stringify(seedToAccount(input[3])),
				);

				const keystoreString = JSON.stringify(keystore);

				const stringResult = await decrypt(keystoreString, input[1], true);

				expect(JSON.stringify(stringResult)).toEqual(
					JSON.stringify(seedToAccount(input[3])),
				);
			});
		});

		describe('invalid cases', () => {
			it.each(invalidDecryptData)('%s', async (input, output) => {
				const result = decrypt(input[0], input[1]);

				await expect(result).rejects.toThrow(output);
			});
		});

		describe('invalid keystore, fails validation', () => {
			it.each(invalidKeyStore)('%s', async input => {
				const result = decrypt(input[0], input[1]);

				await expect(result).rejects.toThrow(Web3ValidatorError);
			});
		});
	});
});
