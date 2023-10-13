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
import { AbiEventFragment, LogsInput } from '@theqrl/web3-types';

export const decodeEventABIData: [AbiEventFragment & { signature: string }, LogsInput, any][] = [
	[
		{
			// unindexed event
			type: 'event',
			inputs: [
				{ name: 'a', type: 'string', indexed: false },
				{ name: 'b', type: 'uint', indexed: false },
				{ name: 'a', type: 'string', indexed: false },
			],
			name: 'EventNotAnonymous',
			signature: '0x7bbee60e68739c7319c204bae2f54caab4114edf476c64bfc5be98af25f446f5',
		},
		{
			address: '',
			topics: ['0x7bbee60e68739c7319c204bae2f54caab4114edf476c64bfc5be98af25f446f5'],
			data: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016300000000000000000000000000000000000000000000000000000000000000',
		},
		{
			address: '',
			topics: ['0x7bbee60e68739c7319c204bae2f54caab4114edf476c64bfc5be98af25f446f5'],
			data: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016300000000000000000000000000000000000000000000000000000000000000',
			id: undefined,
			returnValues: { '0': 'a', '1': '24', '2': 'c', __length__: 3, a: 'c', b: '24' },
			event: 'EventNotAnonymous',
			signature: '0x7bbee60e68739c7319c204bae2f54caab4114edf476c64bfc5be98af25f446f5',
			raw: {
				data: '0x0000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001610000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016300000000000000000000000000000000000000000000000000000000000000',
				topics: ['0x7bbee60e68739c7319c204bae2f54caab4114edf476c64bfc5be98af25f446f5'],
			},
		},
	],
	[
		{
			// indexed event
			type: 'event',
			inputs: [{ name: 'a', type: 'uint256', indexed: true }],
			name: 'EventIndexed',
			signature: '0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
		},
		{
			address: '',
			topics: [
				'0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
				'0x000000000000000000000000000000000000000000000000000000000000007b',
			],
			data: '',
		},
		{
			address: '',
			topics: [
				'0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
				'0x000000000000000000000000000000000000000000000000000000000000007b',
			],
			data: '0x',
			id: undefined,
			returnValues: { '0': '123', __length__: 1, a: '123' },
			event: 'EventIndexed',
			signature: '0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
			raw: {
				data: '0x',
				topics: [
					'0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
					'0x000000000000000000000000000000000000000000000000000000000000007b',
				],
			},
		},
	],
	[
		{
			// anonymous event
			type: 'event',
			inputs: [
				{ name: 'a', type: 'string', indexed: false },
				{ name: 'b', type: 'uint8', indexed: false },
				{ name: 'c', type: 'uint256', indexed: false },
			],
			name: '',
			signature: '0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
			anonymous: true,
		},
		{
			address: '',
			topics: [],
			data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
		},
		{
			address: '',
			topics: [],
			data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
			id: undefined,
			returnValues: {
				'0': '0x',
				'1': '12',
				'2': '192',
				__length__: 3,
				a: '0x',
				b: '12',
				c: '192',
			},
			event: '',
			signature: undefined,
			raw: {
				data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
				topics: [],
			},
		},
	],
	[
		{
			// anonymous event without anonymous flag
			type: 'event',
			inputs: [
				{ name: 'a', type: 'string', indexed: false },
				{ name: 'b', type: 'uint8', indexed: false },
				{ name: 'c', type: 'uint256', indexed: false },
			],
			name: '',
			signature: '0xdd64d7f331676de21d95ea9f7eb8585b688f72afec29a51ff4502fd5a6ae19e7',
		},
		{
			address: '',
			topics: [],
			data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
		},
		{
			address: '',
			topics: [],
			data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
			id: undefined,
			returnValues: {
				'0': '0x',
				'1': '12',
				'2': '192',
				__length__: 3,
				a: '0x',
				b: '12',
				c: '192',
			},
			event: '',
			signature: undefined,
			raw: {
				data: '0x0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000007d0000000000000000000000000000000000000000000000000000000000000002307800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016200000000000000000000000000000000000000000000000000000000000000',
				topics: [],
			},
		},
	],
];
