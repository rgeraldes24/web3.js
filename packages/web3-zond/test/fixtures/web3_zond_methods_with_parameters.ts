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

import {
	DataFormat,
	DEFAULT_RETURN_FORMAT,
	FMT_NUMBER,
	Address,
	BlockNumberOrTag,
	BlockTags,
	Filter,
	HexString32Bytes,
	HexStringBytes,
	Uint,
	Uint256,
	TransactionWithSenderAPI,
	TransactionReceipt,
} from '@theqrl/web3-types';
import { transactionWithSender } from './rpc_methods_wrappers';

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBalanceValidData: [
	[Address, BlockNumberOrTag | undefined, DataFormat | undefined],
	[Address, BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined blockNumber, undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	// Undefined blockNumber, returnType = DEFAULT_RETURN_FORMAT
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined blockNumber, returnType = DEFAULT_RETURN_FORMAT
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x4b7', DEFAULT_RETURN_FORMAT],
	],
	// Undefined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Undefined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Undefined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	// Defined blockNumber, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x4b7',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, boolean | undefined, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, boolean, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined, undefined],
		[BlockTags.LATEST, false, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, undefined hydrated and returnType
	[
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			undefined,
			undefined,
		],
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			false,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, undefined, undefined],
		[BlockTags.LATEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, undefined, undefined],
		[BlockTags.EARLIEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, undefined, undefined],
		[BlockTags.SAFE, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, undefined, undefined],
		[BlockTags.FINALIZED, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, undefined, undefined],
		[BlockTags.PENDING, false, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = true, and undefined returnType
	[
		[BlockTags.LATEST, true, undefined],
		[BlockTags.LATEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, true, undefined],
		[BlockTags.EARLIEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, true, undefined],
		[BlockTags.PENDING, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, true, undefined],
		[BlockTags.SAFE, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, true, undefined],
		[BlockTags.FINALIZED, true, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = false, and undefined returnType
	[
		[BlockTags.LATEST, false, undefined],
		[BlockTags.LATEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, false, undefined],
		[BlockTags.EARLIEST, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, false, undefined],
		[BlockTags.PENDING, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, false, undefined],
		[BlockTags.SAFE, false, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, false, undefined],
		[BlockTags.FINALIZED, false, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = true, and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.SAFE, true, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, true, DEFAULT_RETURN_FORMAT],
		[BlockTags.FINALIZED, true, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.SAFE, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.SAFE, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.FINALIZED, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.FINALIZED, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.SAFE, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.SAFE, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.FINALIZED, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.FINALIZED, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.SAFE, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.SAFE, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.FINALIZED, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.FINALIZED, true, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getBlockTransactionCountValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, undefined],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, undefined returnType
	[
		['0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae', undefined],
		[
			'0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, undefined],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, undefined],
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, undefined],
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, undefined],
		[BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, undefined],
		[BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
		[BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
		[BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.SAFE, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.SAFE, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.FINALIZED, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.FINALIZED, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.SAFE, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.SAFE, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.FINALIZED, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.FINALIZED, { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - mock RPC result
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 * - expected output
 */
export const getTransactionValidData: [
	[HexString32Bytes, DataFormat | undefined],
	[HexString32Bytes, DataFormat | undefined],
][] = [
	// Defined transactionHash, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined transactionHash and returnType = DEFAULT_RETURN_FORMAT
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined transactionHash and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionFromBlockValidData: [
	[HexString32Bytes | BlockNumberOrTag | undefined, Uint, DataFormat | undefined],
	[HexString32Bytes | BlockNumberOrTag, Uint, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[undefined, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block, and undefined returnType
	[
		['0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2', '0x0', undefined],
		[
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			'0x0',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block and undefined returnType
	[
		[BlockTags.LATEST, '0x0', undefined],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', undefined],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', undefined],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.SAFE, '0x0', undefined],
		[BlockTags.SAFE, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.FINALIZED, '0x0', undefined],
		[BlockTags.FINALIZED, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.LATEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.EARLIEST, '0x0', DEFAULT_RETURN_FORMAT],
	],
	[
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
		[BlockTags.PENDING, '0x0', DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.LATEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.EARLIEST, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		[BlockTags.PENDING, '0x0', { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionReceiptValidData: [
	[HexString32Bytes, DataFormat | undefined],
	[HexString32Bytes, DataFormat | undefined],
][] = [
	// Defined block, undefined returnType
	[
		['0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547', undefined],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block, hydrated = true, and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0xe21194c9509beb01be7e90c2bcefff2804cd85836ae12134f22ad4acda0fc547',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getTransactionCountValidData: [
	[Address, HexString32Bytes | BlockNumberOrTag | undefined, DataFormat | undefined],
	[Address, HexString32Bytes | BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined address and block number, undefined returnType
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	// Defined block, undefined returnType
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = DEFAULT_RETURN_FORMAT
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block and returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const estimateGasValidData: [
	[
		Partial<TransactionWithSenderAPI>,
		HexString32Bytes | BlockNumberOrTag | undefined,
		DataFormat | undefined,
	],
	[
		Partial<TransactionWithSenderAPI>,
		HexString32Bytes | BlockNumberOrTag,
		DataFormat | undefined,
	],
][] = [
	// All possible undefined values
	[
		[transactionWithSender, undefined, undefined],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, undefined returnType
	[
		[
			transactionWithSender,
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			undefined,
		],
		[
			transactionWithSender,
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.SAFE, undefined],
		[transactionWithSender, BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.FINALIZED, undefined],
		[transactionWithSender, BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, undefined returnType
	[
		[transactionWithSender, BlockTags.LATEST, undefined],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, undefined],
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.PENDING, undefined],
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = DEFAULT_RETURN_FORMAT
	[
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
		[transactionWithSender, BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
		[transactionWithSender, BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
		[transactionWithSender, BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			transactionWithSender,
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			transactionWithSender,
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			transactionWithSender,
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getFeeHistoryValidData: [
	[Uint, HexString32Bytes | BlockNumberOrTag | undefined, number[], DataFormat | undefined],
	[Uint, HexString32Bytes | BlockNumberOrTag, number[], DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		['0x4', undefined, [], undefined],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, undefined returnType
	[
		[
			'0x4',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			[],
			undefined,
		],
		[
			'0x4',
			'0xc3073501c72f0d9372a18015637c86a394c7d52b633ced791d64e88969cfa3e2',
			[],
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		['0x4', BlockTags.LATEST, [], undefined],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.SAFE, [], undefined],
		['0x4', BlockTags.SAFE, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.FINALIZED, [], undefined],
		['0x4', BlockTags.FINALIZED, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, undefined returnType
	[
		['0x4', BlockTags.LATEST, [], undefined],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.EARLIEST, [], undefined],
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.PENDING, [], undefined],
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = DEFAULT_RETURN_FORMAT
	[
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
		['0x4', BlockTags.LATEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
		['0x4', BlockTags.EARLIEST, [], DEFAULT_RETURN_FORMAT],
	],
	[
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
		['0x4', BlockTags.PENDING, [], DEFAULT_RETURN_FORMAT],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	[
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR }],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	[
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER }],
	],
	// Defined transaction and block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		['0x4', BlockTags.LATEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		['0x4', BlockTags.EARLIEST, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
	[
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
		['0x4', BlockTags.PENDING, [], { ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT }],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getStorageAtValidData: [
	[Address, Uint256, BlockNumberOrTag | undefined, DataFormat],
	[Address, Uint256, BlockNumberOrTag, DataFormat],
][] = [
	// All possible undefined values
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			undefined,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	// Defined address, storageSlot, and blockNumber
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.SAFE,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x407d73d8a49eeb85d32cf465507dd71d507100c1',
			'0x0',
			BlockTags.FINALIZED,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getCodeValidData: [
	[Address, BlockNumberOrTag | undefined],
	[Address, BlockNumberOrTag, DataFormat],
][] = [
	// All possible undefined values
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	// Defined address and blockNumber
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.LATEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.EARLIEST, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.PENDING, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.SAFE, DEFAULT_RETURN_FORMAT],
	],
	[
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED],
		['0x407d73d8a49eeb85d32cf465507dd71d507100c1', BlockTags.FINALIZED, DEFAULT_RETURN_FORMAT],
	],
];

/**
 * Array consists of:
 * - input
 * - mock RPC result
 */
export const sendSignedTransactionValidData: [[string], [string, DataFormat, undefined]][] = [
	[
		['signedTransaction = HexString'],
		['signedTransaction = HexString', DEFAULT_RETURN_FORMAT, undefined],
	],
	[
		['0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'],
		[
			'0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
			DEFAULT_RETURN_FORMAT,
			undefined,
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 */
export const signValidData: [
	[HexStringBytes, Address, DataFormat | undefined],
	[HexStringBytes, Address, DataFormat | undefined],
][] = [
	[
		['0xdeadbeaf', '0x407d73d8a49eeb85d32cf465507dd71d507100c1', undefined],
		['0xdeadbeaf', '0x407d73d8a49eeb85d32cf465507dd71d507100c1', DEFAULT_RETURN_FORMAT],
	],
];

/**
 * Array tests getPastLogs and formats valid fromBlock and toBlock
 */
export const getPastLogsValidFormatData: [Filter][] = [
	[{ fromBlock: 0, toBlock: 100 }],
	[{ fromBlock: BigInt(0), toBlock: BigInt(100) }],
	[{ fromBlock: '0x0', toBlock: '0x10' }],
	[{ blockHash: '0x19e54b41ac6ed5eb5045aab59967489bbab1852e742857b1987f62290a4b89af' }],
];
/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getPastLogsValidData: [[Filter, DataFormat | undefined], [Filter, DataFormat]][] = [
	[
		[{}, undefined],
		[{}, DEFAULT_RETURN_FORMAT],
	],
	[
		[
			{ blockHash: '0x19e54b41ac6ed5eb5045aab59967489bbab1852e742857b1987f62290a4b89af' },
			undefined,
		],
		[
			{ blockHash: '0x19e54b41ac6ed5eb5045aab59967489bbab1852e742857b1987f62290a4b89af' },
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			{
				address: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					// Using "null" value intentionally for validation
					// eslint-disable-next-line no-null/no-null
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
			undefined,
		],
		[
			{
				address: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					// Using "null" value intentionally for validation
					// eslint-disable-next-line no-null/no-null
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			{
				fromBlock: BlockTags.LATEST,
				toBlock: BlockTags.LATEST,
			},
			undefined,
		],
		[
			{
				fromBlock: BlockTags.LATEST,
				toBlock: BlockTags.LATEST,
			},
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			{
				fromBlock: BlockTags.PENDING,
				toBlock: BlockTags.PENDING,
			},
			undefined,
		],
		[
			{
				fromBlock: BlockTags.PENDING,
				toBlock: BlockTags.PENDING,
			},
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			{
				fromBlock: BlockTags.EARLIEST,
				toBlock: BlockTags.EARLIEST,
			},
			undefined,
		],
		[
			{
				fromBlock: BlockTags.EARLIEST,
				toBlock: BlockTags.EARLIEST,
			},
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			{
				fromBlock: BlockTags.SAFE,
				toBlock: BlockTags.SAFE,
			},
			undefined,
		],
		[
			{
				fromBlock: BlockTags.SAFE,
				toBlock: BlockTags.SAFE,
			},
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			{
				fromBlock: BlockTags.FINALIZED,
				toBlock: BlockTags.FINALIZED,
			},
			undefined,
		],
		[
			{
				fromBlock: BlockTags.FINALIZED,
				toBlock: BlockTags.FINALIZED,
			},
			DEFAULT_RETURN_FORMAT,
		],
	],
];

/**
 * Array consists of:
 * - array of inputs
 * - array of passed RPC parameters (excluding Web3Context) - This is to account for any defaults set by the method
 */
export const getProofValidData: [
	[Address, HexString32Bytes[], BlockNumberOrTag | undefined, DataFormat | undefined],
	[Address, HexString32Bytes[], BlockNumberOrTag, DataFormat | undefined],
][] = [
	// All possible undefined values
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			undefined,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block number, undefined returnType
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.SAFE,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.SAFE,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.FINALIZED,
			undefined,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.FINALIZED,
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block number, returnType = DEFAULT_RETURN_FORMAT
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			DEFAULT_RETURN_FORMAT,
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			DEFAULT_RETURN_FORMAT,
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			DEFAULT_RETURN_FORMAT,
		],
	],
	// Defined block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR}
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.STR },
		],
	],
	// Defined block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER}
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.NUMBER },
		],
	],
	// Defined block number, returnType = {...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT}
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			'0x1',
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.EARLIEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.LATEST,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
	[
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
		[
			'0x1234567890123456789012345678901234567890',
			['0x295a70b2de5e3953354a6a8344e616ed314d7251'],
			BlockTags.PENDING,
			{ ...DEFAULT_RETURN_FORMAT, number: FMT_NUMBER.BIGINT },
		],
	],
];

export const tx = {
	blockHash: '0xb3a667f84f58c90ab87476073e06c5d1186a0f0b0b69aa3033bfe0e4df264350',
	blockNumber: '123',
	from: '0x01ada9d3470eb9eb3875d9e7948c674804ca43ae',
	gas: '21000',
	accessList: [],
	maxFeePerGas: '10000',
	maxPriorityFeePerGas: '',
	hash: '0x84f44dffc3cd90a1b66ad0219a97680308e5e7a77299fbf1e2ebb572cf02cc2d',
	input: '0x',
	nonce: '61',
	to: '0x0000000000000000000000000000000000000000',
	transactionIndex: '0',
	value: '1',
	type: '0x01',
	publicKey: '0xdd7c87d17d3fcf7023c405ff0a91e22113a611447b16da12055af7247f624bfeef35973ffd35cde534367e66a6150714899be22b86b93046b1043cc0b4b606a69382946ccc07d2e407519c94204d5ed8f7448dbbc39070903bec56292045882275cc620bd9365cd3cba5b3bb4410eefaf5577b3c75a7ea98369256e2a3c6b0b310507b1a0f2970fcd891cdeb6277674a7581e168f2be7205a5797d1b75c01d0d294574333cce057b0f67ea7c902ca7a121b8eddf408c78b0f2ec21b4285a17a443225d285ec4ceed14864fad3d71b2644d33244be0f76bf56a6cef772e2b8774db90e10affd4c4960a519dce5b0a7412c43c00604296cc03314c2f880156c191b7a034524b5f2b069e9d36829565d35c1155973e1a6672223d7de965ea428affc1d372302de26d8f109788da68c05008d150fdf7d9164aa3fecfdf754a7fc1cb69f7537e24f87c396ed9ce19625df470b2d83be5fa8df03ec5f52f39d10cb81d3a6b05ea9efd23670fd20db01f3d08c3b1ba7cc65e86c73635ac3ecaad70418d8779b53de4fb786679d7436e81646262710fca67743cab7491b5763b1e921996633a4878ae4f9b16481b236054226f0c2951b2bee0a0fc057d8248d719ca3c1404c41c972d8ce3d7b612066c0dbe7cf8ee871f1783ae3da2a32a0908195f44e81992bba297b673989bb1dde9e54bed429cce5d0e221107466b06dc53e4379f38e38687480186f09300d3b5e80adb80120dbb1907a75bd16b08d102ff2df1aad42ac61aa08500bbf79ceaffa2eb470be257d48580910fe64c536e52b87a458d8985bb6bb896ef95713a698f90bc4afd52054042326d8230cf0e66e9841bcd7e1c06900bd773d4bba7cce6c577f91c40c2da18e8da1681136d824388efb551033e22293e2f1b44be3098307a3bfe71b568fc1da14e573ba1ace1b604b5dae5ceccc4dd3e2dd61fd52db4376feb2d528b95d476711c9f940923b8f41f1e06bae5964268f9ba57de5ae2ca9620a4d3e2440eb332f9d88fd59c15a73b8e226ce0a30a6f5a85547c0d128a9e04c248f24a3afa21e32acfef6c738edefcf61ba3683a3e5bd73d0372f00f51c7e063043f4a3601806df5fc971c4542d4e671597cb02a9abf0b0502d46b6f98f6e73d14923828dd1297a664ae1e8e9354452885077932148bbf71f9a3c7354201dcb5ed4e75591ede7d85fe58d72ef8989be383ec96d71f199e5aa21250bc7220cc98bb43fb4fb9dc04b01ded4f8e0b4cc9d57a8a741bd368aa2eab84073e880e1468d215ac46c6d5b6f839cdd4b38c306a03139763efba6e656224a3a33f0e8992b3e592eb2311337e08b1990d625d2afeb6d62295c6eb5c4db4accec883b526182b5f8a848ccb078d20c9dd168917c4e524dca8177c5a39a2a8871e3413077341283f510a531714d9becab7936b8c5e96c7489b5a2cb8182c1fff7aa4a7a0f98b2a5eea94932c77c25c7ac38f802ef7f1615f664db8b72a03a78485b855221b1816655803e5ab77e2e171a37faa53a06655b1e65e2531826e0135f41bc781cb3515cf0d139290c323e7ecca33321d42e19b0bba6d97914d7bbe97847bb1bf2653910c055d8d9b159777cce143d15a9fc606225ceb6385a20ad732893198c68486ab6fb9951fa87fe0e38f93241c52db6d854d058f3263716a9784174959efe0c97cca6d3d13dff9d1633d7baa76d52b8e286623f19a8298dbd11cc592506a33ceb7b28e261986fad5154c8c648203798673c4c8b5046b4781ebcb2ebd797dcef0ed03c6d10bd54e4a4adf71fc081039b88b24e9831cb9046f59f55a63ab187ae6e4abc30f1c9d1f9698914bfb08b83dc6ac71cb09ce30e41162997ef59177748f7a5328b2c36e2a0b42d177231cc4ede3254f06c29c716c4cff9c97e7f6fa1cb49c40cf844226ff59bfdb2aee689f2b89e6d72c7499fdf81eec8e22babc28e2749c3459090138899b5334839aa0eef3f247f22c3682282697302290e89df81d5b355e6316811f9c6946228ca04d389ebce3942eb6daaa441fcd0d921d52f06b9117298c3fa5f404669a1e34d7cdc16b12ce10ff830b5ccf2fe3407bd06423c849afe65479e99c28046bf729ec4e4a748d7547205998be3f5b4904638a677e01d178602929ed91f5818d3ecf57d2126fd1d36a356a5d37760e3877a02ee0ae500db1e096289a80b9ea3d22ff7642a2a6311d4d74838d1740bfbc264d71058e3b5299316730358fbf498ad4916af0300c852984e1a5a1769948ddccbe3262f65ed15ac60af2d7d9101381cd197d51f241279ad81e138236e993c272ecf8f2dc6ae4632866865d7a4108c9920f749d1d4ec95e6e39297407c76a1296cac5737d0762a8730acf26dbf79df34bbfed0d6b1774e4f14bf891bf9590a104885e1bd9c7e00d3e51b93c7af0e2e79edbe6e0729c9bc02fcf90fc581fb9b7ca03e2fda0c65f45314043a9f7ed84b4849c19f020c73b0ee21224d39a47e47f66d2145948cda62a0caeadd22bf50a472537f1088410afead959841ab74820db1587ac8a642fb8b56d813e15806caeb5ce245f3a5fe48a764f4054bb7852596d71aa013b40c9ded467a715c91fc965b97fccd19cd6ab899ee2d46fd619ec4fe047a2abbe9b7ea4ddd3e40cee964f75ea61d960ea312f8c36f6f057dc1bbc51152391c093cc0fb26b67ebc2d6a6d986e35f557117fdfdd9943b8e8cdf3c1dfdfd64b352f9e180eaf5934591f62fafdf129e85fd0f47a6a30cedeb15ac718b7cacd54b6011e5c59491272779b8c9a5ec806db2c961286546bff5935c0e6e14644ca0d46471bed78950014915551911d610fa380a9ef7bba4ca8add1d22e992ff009663ef19e14aee1027da01959a2f5a86d4527d3994b2aa9b4a0c83a4543d7f43d1fb23f38c1464ff1c995f3d4c00eb69eaeab804b9d02e7c887b1138bbf684028ac6cc9bf47caecadd843c69ae717a3526bba50d355ccec4b3dd9d929ffb0b181a9de278b1f77d629265092d5b210d786b8624ab90353e224bbd57d911b63b50a67c7efd890311ea2fc8e65573006783f35234e89936f7d15daab14eb1d07c8b915c66c8156180ec78502e9ddefb4b65bf4e500029ce1a43a5dd0202b132ee3cadb32a1736930cfacd46011a0d6f6c580477e4ed339454d308be708c5f584604d4c7ac71ba7d66686c18912a010fecdadc1e5472773b2baff775b6d4dd6a6f951bec3746b78070ddcdfe8332e1847fd83194e5c03aa7a58d46163a65e3561b139fec15e1d172c4b64276f0f89aa86e8cc54802af590c9d162e1f91fb9dc64c5b1db838f6076b48d4586dc69614622ae48da679c42139e08871345cf35f04bb6a56842924803b576f6d2931856fdbcc37b5b1b920307bb3e03a8e31cf28eee6c9541e91d25bafba7cc92051b912afc0c4bf0ea1bf98d4589600b28fe80e360354165a0819f874b8391b02fb575ef5a61215afc0d4e8fc2fca54936291ffec578f68b5c6622f69a2b9dd40e48e27a8553d4a85ed25f1942ea22ab9ca568508d99da5f717849cc9597f2514652558aaa5292df584e0c752df5e14d66de129637129acd1927179db44dd74510f569379bdf88ac1c2ef883eb70eb3bf94f1acdee2c6e26ff222a70cf257d7239146b46ac1b0b5630442097e2f5a52bb65110d',
	signature: '0x6a0d435e0c61b820d147823e165e94eb7145cad30a197e4483b74f2361e89544d30a6110662137cf20c88fc2a25e89b52c2a291ff75183e6faa07b649674c3fad1c1efb4d831beb19dd5cf64450935e0a862cad65a3cd21d9c886308e7d656e8688604b56ed610c908403731e5d1af848fc3554b5484db50308396cbfbe47e72bf1d2ffd6c3e92798ce243bc6165c25e9bc5a95fafff0761bbd5a36b3b015e801bff41eae440b572094b2d2133b66b75e556984b20e72f6c29cc0bb2c6c8fd1f7bbcbcfd6894daeca9779f75e4fe27b7fcd45da3a90c79fa815f660a92e8ed7f50d81fae8ede6cbf754c780460e041398b33dcd5178bb2987e029c967a2c20cc73bfcbc7acc946dbe506cd224a3816d6c0524942746ccbda4aba968aaade03cbc146cdc2336eb0ad832bbdbba9cb6eaf8cc2c2a5861f591d175527f759dbdeb562f164638f64bd4dd72b80b8ae4d2516bc183343c046726ca998c0db0c05759cd704fe43a57995673d63e6ae605e2191a6d3b3f875662ec7ebbce7506aecc33c49a651d15c27e80bd0cc0088fe17cec596f47ece16fbf0ec857bdab65488830928594455e1f9bc8c862a3d31fce7ad1beee32175e94e44753f8f85713cd809e563c3dddf384c6733dcb2df0d8cd490bed092c20cbf43f7a957bd25a6f8534f857f5b4a87c83d248dca0b7f876df3347a0fa1c98a9a9dd48246ba979276518945dd8cf9a6275d5b34455ba7144c40e8fc7a3da32ccaeb1681d0bd390d3211dde1427552f3474fde89d57593c87ac07d998d3a8330ef707f30b79d905ab6278517cc316bd391cf9622d83ca7b6bb6a202b69f50f2c45b0c2fd868b2b72a67d7a810146b750b132d704c9fc67a2b0895efdeb4c52292c350bc4d9639a4bd4e58b704a1480225e6e0c335f74f732402fc3c0e5b4f46ab6a4e2b6ffa1efe894eed451a930c43d48ab1f20ba0e1e17c30e8b7f0df3b66dbb69c6aa3a9bf4471234a6cccefb3690a6cdcf9a35ca8c2d6424bfdcf35bf6baf8123c540235bd6cc456a006ace0538fe33adf641364054257113071a5ac8addb3de5f85e323c6d7996a6888e1d4138f809815d91cc299a7ef08c5e06251db6d2c524f9d62e7990e89ef6c0a592967441b6462a07577325cbc6c98112009f12d233d501aa971d64933e7032a92b2ff86980944d9bc4dea2f6a2fcf5b3525bea80edcec2f610e7afeaa1b7ba3b0f58baa2d6045941f67d645f97fc5e502134f1da844bb539a5389a7cd8100b0b70c5087c38e9987c849cfaac91e11afaef613be2e29250f61d943e8916fe485f751426b4172e7cc6182d9f7c4d2f364c6a904e575aa765556682ac1231067e4ed33866158eeebbbfbda3b29008fd96ed45d22bb46a0debe59dfe8fb7d3402572ba2406d5c1e01ce5c4114deff10fef0bee2ed1abdf090daed961006c9e100052603f050dae80d5e5e6ad207479f02b8e9299ef65d94881648e0bea436bbf1f04ebdfa732098d4b36ed61e5552682c2f290cea2a35674977724d33d4451591f644eb958e8d30680906d071ef865ebc8013599e75fe54fb97b331c69c5d0e18659f381b4dd1ce8c411178572557b12e0dec85ac9a83c02b2c132b34f8a48ba78a8ba6b58eb9733a3cdd01328940ae5db3e9290f0c176c00d0f59c3e64cde87a2350bfd3523915f071a83ddf8b69563c5cadbabe2974be597de008f5913af3cf415ac1839115c3c24a0b3e2597cdfcc31b8d3c4dbfd3fd02c10978a52990c3cf98aeeecc1ed9f8267b7392c2188b15f0ca14a3449cb9b1a7ffff7f1f62952fe61db86d5c9f87a23c8075cb582b2024a4762023b02e70a44b42cbe534f87bbc64d46c84a41b0b76448a8c42dea1871509f78dc516e5229f3a151ee49f16102abf93a2231114701a0b6e863dc59963918171372ed67d7249ba2b1876fdee8fcb99fa16b468940b959b3a9b68c81d52edbcaa54fbd383ae94882cb47fdc935cc837990ee416b2d0b09fdcfaaf0b9ec066f1cfdc7b8738148b96e337a91b7d5b003130b3028ffe47cf1c2e174beec34ec1c5a969494ab8968131ee35234ad7360cc27dcd964efe247a12b48d56b39911f2a3e57ef98e08c7e49c1d3a62cfbb3c9c674992fccf3b922d7b3cba6c0eb97b6b3fb8960750e489de7e1da100e4df245e801fc0f01bb96279c418b34cd98b6ef703158cb315c5e109934f751db7599b9c519a6182029e3c77f2c915ab55db395ac0e0a0908c8c775022c6afb9195a4ff9b9afdd6b9d899175a096b1f57649e51498f4e9476cf645cb86428ea852fc07880830927c4f3676af111aa2ffb590385a95006221bc21396b19d9e3c05149551da806e3de0165fd676d08cb39612d796d99f0b2384a5dd30e5bd10da578e2ac9da5ca4db50e50aff49aae329f9e484562ce2fe1739c7abe2799594286cf4904c0c9f9082f0e05ce4a7ceab6a83c07086ba66da27737e4ba2b4d6120e24c1d723326b60e6ed2657e1c0f61259b9f1a23a80851022cf9ddcde2a337d5a74a5e9413fe2f9a8e66cd34c20ef97efccd276dbdc6302fbac17e97a95ffdc797e59fe6dc5ffded4759ca19e8c9b9e3814a27572dc1c932862718bbd7774d5723219a77a65aed1688db36040c945a5488bbe75475c1bd4ea9ef40a93e4f08b1bf258768f9b2ef5d1b5c52bd369612ecf95c18f0109f5965840af5cb73fd6bd07cd1a30780924cf3ec88bf14c4695895354c3408b2bc33d001d5bf07d940d32ce8658ae19d43d27ae48bab17fcc3c7b08af6dcbd482aeb9dd5986c82fb9a7abc666a0abcb49ceb81ac50a71b84ed0afffa307d889b1a8acef7cb63f2bf00b42767a586f3d29bfe60e6e10783db7197219e137f200740cc760494607850c32d7697765bf9710161dd1d19b4280c0c6072cfce1554b18e9e126456be748e0b90e0d93c0b4ee9754d56852f92613031f722f3d57bf0068eb55a11d92881df85a98d41406892d48b2bad44bce05d6b2f05c486dd7f55ecab561433652669ad27b0974931d4ab13cb5ec9a2fc71071f8167331e5dd7552efd4d7b01541162c934edde318b4259c64fec894b792e4772d684bf43bf882d76f8f60f6e6ea974f8cdcc67503c99fff915fd74100c2e73edbb7fd3c0bc02fbd18a15894ef1efab7ea49a9f00e2f4006159f1ffde9d4374763842cf3463bf825a95c7e6ce22c3438cd8531ac7e4613a72b0540d02f9275708cb7944d8b59b2a5aa19a61035a0db38dc4f0efdc4e9d3cd02c4cb8d43ae7540b3f66d00e9a82fd7dcc51b305862a3ac97e8f3c84df7b3391c45933053b16b6f939049e4fceca224574454407e35675fd16d8d4f48f77a07596c50fd5bb02f51133c049744e522a86aa82932694f129b3015c706acced2266808f615a43f836755e601354eefaca99d30c184031c0f1bec9909aba6c865fd2e992b5b438e88ac82cb025c062d9cebed865975a1369a01e4ab56d2531b522d6873127d569d8f0f5bc0c4dd40f054c87ba5029cc28d6dcd3e7a6dc089fedc451769b23d047904a2398289c16650c4721921c3201646f193aaa46b9ab7741ffc8cbac4ccdd7524134724eb21317891f6ff3ccbdbef8ecb10fc5aa4c8c141d1c52a56ae091666a828a0ab67053be248d22ab69cd89d6edd46fc29a4f6e4e009a3aa26c67d015dd915c1c0bbf9639a57ab50032ac0e524b2ff4bd1f3a036edda5bb957060a71ea1d4c77df8e9ea49c46039d50799ac86bd0f17faf4c7c82265f0ca2b4cefb484a179923c81b169a825790204d65e9334cdde6f767b673d77635603796108c48273929e377b7e34ce48d9c9fb3e4f2403fb9dbd64a888b29e0982f37e81c2d8d7fdc0e5b9f9fd2b5dd100ab1d5baf5f74fc38a1f801847ba98c107c0ff788c5a4db0d29e27004c6b3925fe6164816c1028f22facb60fd8f1d4f1c692c3ead673f2b0670be9a1dd49299d0c5dfd2cdae9e19136a8d07183220aa19e6cb5e259a715be07e4df4057dc6a51f10021f4d859ec85fc50b5388da849939fa43b270d16dbc221b2bf6b670a8912a247279344af155e1a7c1a0b786cf38e2d5292e472bf6e4b665b0b2f659b75ffb2aa3d3c3f743b537f0d121beee52fc6deb6548954c5ab938a4eac96fe6e501ffa5a1c63b1aecc527f869d535b14aa3847444639f570bd30e70c356acc6f72ca67fecc378bec7ce782421fff39c4985a64248d75b871889bc7d7964c484340ca60fba30664479286a0862faa0ecef624bd7c846d0ec1fad65a01b9947ed572ac3c57e8d849be6e17f9c79229bd61337cf4214dea289618307a3a5a5af622ea6b5ab5706809f481d978a18195235741349d6177d0703b63664fb8c7da05d096905064ca8ba317bf7fe2d7b3ab94b53b367b097ab85096b240b94c0d6805b95be88ece2083e8ef73e0d29ca88a2c0cf810b058326f5ac89597cfe1f0104dcc7ae878fb93bb9609b603ca304b82fa1a9e3a3db9902c01053889e3383125e9135bc8921af25b761aca9117e4a8e6390d33693d46e31e2b62ee8aabef2b74f321d6b42bfd2b673559efedd4e1a58b1ed3b85fc5f2c8cb240693744d3b9ec1d13b03ec2ac39ac5204db97964a2e6a52d343964537e26a2c2b660c4477ceac60b2eb70f2ff85129fe6e29545547b52998b3b354d9cac5b54149b149fc22126dee957175fdf638e75c5457fd91cee888164944fb794a91beed4e776c2281e62a130911c1b8c2639c2638ce39d8f1c14df6a30f9f1ca3786fc11270e0ae8ffe8335059fd7930bb0daf74470b5ec2fa57bed5eb59439e3a245093939248e31dc8b85da0902127d5717239c9abd6beb21cb87624cfdfebf5425a7ebfb0463032a8768a560a7a6d5ce86988c95ddce8d4458d09e0856fce6dea0f97d5e50927e6a5f4d5d6dc2cf4954811f0dbc73af4be8b182fb7dce630be402b02a247df5264c0070c3811de7dd5581d7dffa9220f8fa41386b8da967a2a0a4743c14362b6f78123974e6724ddac7fe1aaca82a8baca4cb56fa62f75ead6fdbad5d6494607eeba7237d2e4ac8c3f2197790551fa6a3fb5992d8a9f998a5420da971e04ff4d4d7210e016234052d4a1ad0886f50ca117bbeeff789a167c8d3f2aeebc01397c3915d94023ec6054f8da3bbe0ab772aafb9a17e0bfab5b9b5e02be98e8c0a04c17799052bc9a6574b942088864522828508cb4b086e8c674673e5fef1c6bcbd08f2cc69040ed901edcbac3eb355dff67970de2a2eda7a7df5b58ca380fec4ee88ee25d8aa654bfa145aa87d79662252dfdc74f5e7a282ce922341eebddc514986135a423dfe3d8eb6181cb0a78ddef6e7fd7c0f002996185420716cad2366a92d56ca7497940bc406ff2a7f36c71e9fc543e441702f79528122535ad1625302c4b879111ef75af7b3e2625257de306247ae04eee1d3c3eac6764a8a4d20f46491ccb23ca9591ab3b38a36e7e7cf3e3a3d22c4dc258ad2809bada96675c5dc2dba868f729cc4df50811fc91f93ce49542f5dfb3064d45bbe9ab5019bd3dc3034832c5d526089805fbbc1142742b426767deab357d2dcb9629f4473826a6b1fc85ef3bc79922828e191424bc0ec55dee974802d70d08e5008fb9666d4df87f8c446235c6bb7cb0b1dbedf7df69a18297c3918b264eac0213a1d760672584681b8066daf7382a8a8fb4d4a09fc9d9be062fbd27ca2bebabed73d6a5cf7301cd86145b2d1f9c2c341cf7b71b2da3c6d37ea3a8b02d81e60fa3a77f575be11284a1dc7531b18b388445d86024c6659e90d6baced6de3ade963955ce5d944b1ae3dbc868d1c8ad7eb0812350c97008ff9e641a30ddd649bd7ab3e974bcc601386addb7c18f141167b4436de279df282608443853491dd07c520af956084c290ec221b2863a883b29ca3756c72d81037c6a99015bdd5898993045164eda727ff8db717ed174c1d552137e8f3809ece6566b71a868f510fd83c65d0aa0a2c7f9ec9a87b364cba58f9c1b6af78eaae0c5eb30427bdb8a6e7209e114472efc6ff3e52fd65155e0e4f28c8d3d3abf06cf484dfcb9ffe05a670178ac9986c8a0db86a9737a9b28f3a3460d8b5d47b67e395cb951c53763b5f765004cd3a15aee7422ef67fe8478860d493022977a26f202c6de50072bb9b14887022be011ad4d42a1f1d823da4d649830b72a2c59fbe7520ed7d133280bf43ceca325afd241f88fbd15402917bd29f652a072e5a3e593537258189b517d9a7ccd53964304af81b424cca587f9c9fac0fa2628fd7fb4a220e4cb195b80b01e164231590925e604dbcecc59b54ce967e7a8fad6c8c3db96ed4daf7ffec89de66ea189b22b00c1faf0dc3d11adb18b8a7a2045b074652b085fea9c22da89ad17d8778ac9e031969d2029317e9fb9ec2365717ba6edf2096f7987999aa8afbbc6e7e81294aaaeccdcfc55bec3df535a8ca1bbf62dd4dbfa0e2f335484a0dde30000000000000000000000000000000000000000070e1a21252b2f37',
};

export const txReceipt: TransactionReceipt = {
	blockHash: '0xb3a667f84f58c90ab87476073e06c5d1186a0f0b0b69aa3033bfe0e4df264350',
	blockNumber: BigInt(123),
	cumulativeGasUsed: BigInt(21000),
	effectiveGasPrice: BigInt(10000),
	from: '0x01ada9d3470eb9eb3875d9e7948c674804ca43ae',
	gasUsed: BigInt(21000),
	logs: [],
	logsBloom:
		'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
	status: BigInt(1),
	to: '0x0000000000000000000000000000000000000000',
	transactionHash: '0x84f44dffc3cd90a1b66ad0219a97680308e5e7a77299fbf1e2ebb572cf02cc2d',
	transactionIndex: BigInt(0),
	type: BigInt(0),
	root: '',
};
