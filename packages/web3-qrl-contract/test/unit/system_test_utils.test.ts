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

import accounts from '../fixtures/accounts.json';
import { partitionSystemTestAccounts } from '../fixtures/system_test_utils';

describe('partitionSystemTestAccounts', () => {
	it('reserves one refill source for a serial test worker', () => {
		const { refillSource, testAccounts } = partitionSystemTestAccounts(accounts, 1, 1);

		expect(refillSource).toBe(accounts[0]);
		expect(testAccounts).toEqual(accounts.slice(1));
	});

	it('gives parallel workers disjoint account pools', () => {
		const firstWorker = partitionSystemTestAccounts(accounts, 2, 1);
		const secondWorker = partitionSystemTestAccounts(accounts, 2, 2);
		const firstWorkerAddresses = [firstWorker.refillSource, ...firstWorker.testAccounts].map(
			account => account.address,
		);
		const secondWorkerAddresses = [secondWorker.refillSource, ...secondWorker.testAccounts].map(
			account => account.address,
		);

		expect(firstWorker.refillSource).toBe(accounts[0]);
		expect(firstWorker.testAccounts).toEqual(accounts.slice(1, 5));
		expect(secondWorker.refillSource).toBe(accounts[5]);
		expect(secondWorker.testAccounts).toEqual(accounts.slice(6));
		expect(
			firstWorkerAddresses.filter(address => secondWorkerAddresses.includes(address)),
		).toEqual([]);
	});

	it.each([
		{ workerCount: 0, workerId: 1 },
		{ workerCount: 3, workerId: 1 },
		{ workerCount: 2, workerId: 0 },
		{ workerCount: 2, workerId: 3 },
	])('rejects worker configuration $workerCount/$workerId', ({ workerCount, workerId }) => {
		expect(() => partitionSystemTestAccounts(accounts, workerCount, workerId)).toThrow();
	});
});
