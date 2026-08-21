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
export const NameWrapperAbi = [
	{
		inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
		name: 'ownerOf',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
] as const;
export const NameWrapperBytecode =
	'0x61010060805234a015610010575fa0fd5b506101ffa061001e5f395ff3fe61010060805234a015610010575fa0fd5b506004361061002b575f356101e01ca0636352211e1461002f575b5fa0fd5b6100496004a03603a101b0610044b1b0610137565b61005f565b608051610056b1b061018b565b608051a0b103b0f35b5fa05fa37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff16a152604001b07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff16a1526040015f2054b050b1b050565b5fa0fd5b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa216b050b1b050565b610116a16100e2565ba114610120575fa0fd5b50565b5fa135b050610131a161010d565bb2b15050565b5f6040a2a403121561014c5761014b6100de565b5b5f610159a4a2a501610123565bb15050b2b15050565b5fa1b050b1b050565b5f610175a2610162565bb050b1b050565b610185a161016b565ba2525050565b5f6040a201b05061019e5fa301a461017c565bb2b1505056fea2646970667358221220aba55ef8a6f05eb3d3f0484d81654b2419533b722a2e1edf11e1d631ad884c0764687970637827302e322e302d646576656c6f702e323032362e382e32312b636f6d6d69742e32623961306631640058';
