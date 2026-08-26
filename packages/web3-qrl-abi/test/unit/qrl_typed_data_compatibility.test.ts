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

import { QRLTypedData } from '@theqrl/web3-types';

import { getEncodedEip712Data, getEncodedQRLTypedData } from '../../src/index';

const goQRLWideValuesGolden: QRLTypedData = {
	types: {
		QRLTypedDataDomain: [{ name: 'name', type: 'string' }],
		WideValues: [
			{ name: 'amount', type: 'uint512' },
			{ name: 'payload', type: 'bytes64' },
		],
	},
	primaryType: 'WideValues',
	domain: { name: 'QRL VM64 Golden' },
	message: {
		amount: `0x${'fedcba9876543210'.repeat(8)}`,
		payload: `0x${'0123456789abcdef'.repeat(8)}`,
	},
};

describe('go-qrl QRL typed-data compatibility', () => {
	it('matches the go-qrl uint512 and bytes64 golden preimage', () => {
		expect(getEncodedQRLTypedData(goQRLWideValuesGolden)).toBe(
			'0x1901d7e1065df6e44a27667668fc0e26439be6b616370f5498c838343aa16569c2468769da44475f49a3fd2df46873783825d5d07199da91e46f10b04e6a93d62e50',
		);
	});

	it('matches the go-qrl uint512 and bytes64 golden digest', () => {
		expect(getEncodedQRLTypedData(goQRLWideValuesGolden, true)).toBe(
			'0x054b04b5b0976d8b58cb06fb10c1100af45cf46488d16842897e6b2a81ed6ed3',
		);
	});

	it('keeps the old encoder export as a deprecated symbol alias', () => {
		expect(getEncodedEip712Data(goQRLWideValuesGolden, true)).toBe(
			getEncodedQRLTypedData(goQRLWideValuesGolden, true),
		);
	});
});
