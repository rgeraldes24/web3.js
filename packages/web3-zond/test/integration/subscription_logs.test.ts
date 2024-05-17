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
import WebSocketProvider from '@theqrl/web3-providers-ws';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Contract, decodeEventABI } from '@theqrl/web3-zond-contract';
import { AbiEventFragment, Web3BaseProvider } from '@theqrl/web3-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcProvider } from '@theqrl/web3-providers-ipc';
import { Web3Zond } from '../../src';
import { LogsSubscription } from '../../src/web3_subscriptions';
import {
	closeOpenConnection,
	createTempAccount,
	describeIf,
	getSystemTestProviderUrl,
	isSocket,
	isWs,
	createAccountProvider,
} from '../fixtures/system_test_utils';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { eventAbi, Resolve } from './helper';
import { Wallet } from '@theqrl/web3-zond-accounts';

const checkEventCount = 2;

type MakeFewTxToContract = {
	from: string;
	contractAddress: string;
	contract: Contract<typeof BasicAbi>;
	web3Zond: Web3Zond
	testDataString: string;
};
const makeFewTxToContract = async ({
	contract,
	from,
	contractAddress,
	web3Zond,
	testDataString,
}: MakeFewTxToContract): Promise<void> => {
	const prs = [];
	for (let i = 0; i < checkEventCount; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		const contractFireStringEvent = contract.methods?.firesStringEvent(testDataString)
		const txObj = {type: '0x2', gas: '100000', from: from, data: contractFireStringEvent.encodeABI(), to: contractAddress}

		prs.push(await web3Zond.sendTransaction(txObj, undefined, { checkRevertBeforeSending: true }));
	}
};
describeIf(isSocket)('subscription', () => {
	let clientUrl: string;
	let web3Zond: Web3Zond;
	let provider: WebSocketProvider | IpcProvider;
	let contract: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	const testDataString = 'someTestString';
	let tempAcc: { address: string; seed: string };

	beforeEach(async () => {
		tempAcc = await createTempAccount();
		clientUrl = getSystemTestProviderUrl();
		provider = isWs ? new WebSocketProvider(clientUrl) : new IpcProvider(clientUrl);
		contract = new Contract(BasicAbi, undefined, {
			provider,
		});
	});
	afterEach(async () => {
		provider.disconnect();
		await closeOpenConnection(web3Zond);
	});

	describe('logs', () => {
		// TODO(rgeraldes24): revisit with the .deploy().send() method
		it(`wait for ${checkEventCount} logs`, async () => {
			web3Zond = new Web3Zond(provider as Web3BaseProvider);
			const accountProvider = createAccountProvider(web3Zond);
			const wallet = new Wallet(accountProvider);
			wallet?.add(tempAcc.seed);
			web3Zond['_wallet'] = wallet;

			const from = tempAcc.address;
			
			deployOptions = {
				data: BasicBytecode,
				arguments: [10, 'string init value'],
			};
			const contractDeploy = contract.deploy(deployOptions);
			const txObj = {type: '0x2', gas: '1000000', from: from, data: contractDeploy.encodeABI()}

			let contractAddress: string;
			contractAddress = await new Promise(async (resolve) => {
				await web3Zond.sendTransaction(txObj, undefined, { checkRevertBeforeSending: false })
				.on('receipt', (receipt: any) => {
					resolve(receipt.contractAddress);
				})
			});

			const sub: LogsSubscription = await web3Zond.subscribe('logs', {
				address: contractAddress,
			});

			let count = 0;

			const pr = new Promise((resolve: Resolve, reject) => {
				sub.on('data', (data: any) => {
					count += 1;
					const decodedData = decodeEventABI(
						eventAbi as AbiEventFragment & { signature: string },
						data,
						[],
					);
					expect(decodedData.returnValues['0']).toBe(testDataString);
					if (count >= checkEventCount) {
						resolve();
					}
				});
				sub.on('error', reject);

				makeFewTxToContract({
					contract: contract,
					from,
					contractAddress,
					testDataString,
					web3Zond,
				}).catch(e => reject(e));
			});

			await pr;
			await web3Zond.clearSubscriptions();
		});
	});
});
