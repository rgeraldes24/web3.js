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

import { Web3ContractError } from '@theqrl/web3-errors';
import { encodeParameter, hashToLogTopic } from '@theqrl/web3-qrl-abi';
import { Bytes, Topic } from '@theqrl/web3-types';
import { bytesToHex, keccak256 } from '@theqrl/web3-utils';

const ARRAY_TYPE = /\[[0-9]*\]$/;

export const assertSupportedIndexedType = (type: string) => {
	if (type === 'function' || type.startsWith('tuple') || ARRAY_TYPE.test(type)) {
		throw new Web3ContractError(`Unsupported indexed type: ${type}`);
	}
};

export const encodeIndexedFilterTopic = (type: string, value: unknown): Topic => {
	assertSupportedIndexedType(type);

	const validationValue =
		type.startsWith('bytes') && value instanceof Uint8Array ? bytesToHex(value) : value;
	if (type !== 'string' && type !== 'bytes') return encodeParameter(type, validationValue);

	encodeParameter(type, validationValue);
	const hash =
		type === 'string'
			? keccak256(new TextEncoder().encode(value as string))
			: keccak256(value as Bytes);

	return hashToLogTopic(hash);
};
