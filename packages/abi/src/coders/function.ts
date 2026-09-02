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

import { arrayify, BytesLike, concat, hexlify } from '@ethersproject/bytes';

import { Coder, Reader, Writer } from './abstract-coder.js';

const ADDRESS_BYTES = 64;
const SELECTOR_BYTES = 4;
const FUNCTION_BYTES = ADDRESS_BYTES + SELECTOR_BYTES;

export class FunctionCoder extends Coder {
	public constructor(localName: string) {
		super('function', 'function', localName, false);
	}

	// eslint-disable-next-line class-methods-use-this
	public defaultValue(): string {
		return hexlify(new Uint8Array(FUNCTION_BYTES));
	}

	public encode(writer: Writer, value: BytesLike): number {
		const data = arrayify(value);
		if (data.length !== FUNCTION_BYTES) {
			this._throwError('incorrect data length', value);
		}

		let length = writer.writeBytes(data.slice(0, ADDRESS_BYTES));
		length += writer.writeValue(data.slice(ADDRESS_BYTES));
		return length;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public decode(reader: Reader): any {
		const address = reader.readBytes(ADDRESS_BYTES);
		const selectorWord = reader.readBytes(reader.wordSize);
		const selector = selectorWord.slice(reader.wordSize - SELECTOR_BYTES);

		return reader.coerce(this.name, hexlify(concat([address, selector])));
	}
}
