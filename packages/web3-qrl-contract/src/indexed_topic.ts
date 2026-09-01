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

import { encodeParameter, formatOddHexstrings } from '@theqrl/web3-qrl-abi';
import { Bytes, Topic } from '@theqrl/web3-types';
import { bytesToHex, keccak256, rightPad } from '@theqrl/web3-utils';

export const encodeIndexedFilterTopic = (type: string, value: unknown): Topic => {
	const validationValue =
		type === 'bytes' && value instanceof Uint8Array ? bytesToHex(value) : value;
	if (type !== 'string' && type !== 'bytes') return encodeParameter(type, validationValue);

	const normalizedValue =
		type === 'bytes' && typeof validationValue === 'string'
			? formatOddHexstrings(validationValue)
			: validationValue;
	encodeParameter(type, normalizedValue);
	const hash =
		type === 'string'
			? keccak256(new TextEncoder().encode(normalizedValue as string))
			: keccak256(normalizedValue as Bytes);

	return rightPad(hash, 128) as Topic;
};
