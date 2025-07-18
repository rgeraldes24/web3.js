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

/* eslint-disable max-classes-per-file */

import {
	ERR_PUBLIC_KEY_LENGTH,
	ERR_INVALID_SIGNATURE,
	ERR_INVALID_PUBLIC_KEY,
	ERR_UNSUPPORTED_KDF,
	ERR_KEY_VERSION_UNSUPPORTED,
	ERR_INVALID_PASSWORD,
	ERR_IV_LENGTH,
	ERR_INVALID_SEED,
	ERR_SEED_LENGTH,
} from '../error_codes.js';
import { BaseWeb3Error } from '../web3_error_base.js';

export class PublicKeyLengthError extends BaseWeb3Error {
	public code = ERR_PUBLIC_KEY_LENGTH;
	public constructor() {
		super(`Public key must be 2592 bytes.`);
	}
}

export class SeedLengthError extends BaseWeb3Error {
	public code = ERR_SEED_LENGTH;
	public constructor() {
		super(`Seed must be 48 bytes.`);
	}
}

export class InvalidSeedError extends BaseWeb3Error {
	public code = ERR_INVALID_SEED;
	public constructor() {
		super(`Invalid Seed, Not a valid string or uint8Array`);
	}
}

export class InvalidSignatureError extends BaseWeb3Error {
	public code = ERR_INVALID_SIGNATURE;
	public constructor(errorDetails: string) {
		super(`"${errorDetails}"`);
	}
}

export class InvalidKdfError extends BaseWeb3Error {
	public code = ERR_UNSUPPORTED_KDF;
	public constructor() {
		super(`Invalid key derivation function`);
	}
}

export class KeyStoreVersionError extends BaseWeb3Error {
	public code = ERR_KEY_VERSION_UNSUPPORTED;
	public constructor() {
		super('Unsupported key store version');
	}
}

export class InvalidPasswordError extends BaseWeb3Error {
	public code = ERR_INVALID_PASSWORD;
	public constructor() {
		super('Password cannot be empty');
	}
}

export class IVLengthError extends BaseWeb3Error {
	public code = ERR_IV_LENGTH;
	public constructor() {
		super('Initialization vector must be 12 bytes');
	}
}

export class InvalidPublicKeyError extends BaseWeb3Error {
	public code = ERR_INVALID_PUBLIC_KEY;
	public constructor() {
		super(`Invalid Public Key, Not a valid string or uint8Array`);
	}
}
