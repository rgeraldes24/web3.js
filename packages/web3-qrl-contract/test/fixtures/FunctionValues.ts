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
export const FunctionValuesAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'function (uint256) pure external returns (uint256)',
				name: 'indexedCallback',
				type: 'function',
			},
			{
				indexed: false,
				internalType: 'function (uint256) pure external returns (uint256)',
				name: 'callback',
				type: 'function',
			},
			{ indexed: false, internalType: 'uint256', name: 'result', type: 'uint256' },
		],
		name: 'FunctionObserved',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'function (uint256) pure external returns (uint256)',
				name: 'callback',
				type: 'function',
			},
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'exerciseFunction',
		outputs: [
			{
				internalType: 'function (uint256) pure external returns (uint256)',
				name: '',
				type: 'function',
			},
			{ internalType: 'uint256', name: '', type: 'uint256' },
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
		name: 'plusOne',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'pure',
		type: 'function',
	},
] as const;
export const FunctionValuesBytecode =
	'0x61010060805234a015610010575fa0fd5b506104aca061001e5f395ff3fe61010060805234a015610010575fa0fd5b5060043610610036575f356101e01ca0637774c3d61461003a57a063f5a6259f1461006c575b5fa0fd5b6100546004a03603a101b061004fb1b061023d565b61009c565b608051610063b3b2b1b06102cb565b608051a0b103b0f35b6100866004a03603a101b0610081b1b06102f4565b61019e565b608051610093b1b061031f565b608051a0b103b0f35b5fa05fa0a6a6a6608051a263ffffffff166101e01ba1526004016100c0b1b061031f565b6040608051a0a303a1a65afa15a0156100db573d5fa03e3d5ffd5b505050506080513d603f01603f19163da1a110156100fc57a0a20336a2a501375b50a0a201a060805250a101b0610112b1b061034c565bb050a6a6608051610124b2b1b06103a1565b608051a0b103b0206101001b9f44903702c81306bebfb458ebb3ea09b615b22cdac9f60d4a696f4304fa6d817d0000000000000000000000000000000000000000000000000000000000000000a8a8a4608051610183b3b2b1b06102cb565b608051a0b103b0c2a6a6a2b350b350b35050b350b350b3b050565b5f6001a26101acb1b06103ff565bb050b1b050565b5fa0fd5b5fa0a235b15063ffffffff6040a4013516b050b250b2b050565b5fa06101dda4a46101b7565bb150b150b250b2b050565b5f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa216b050b1b050565b61021ca16101e8565ba114610226575fa0fd5b50565b5fa135b050610237a1610213565bb2b15050565b5fa05f60c0a4a6031215610254576102536101b3565b5b5f610261a6a2a7016101d1565bb350b350506080610274a6a2a701610229565bb15050b250b250b2565b5fa0a2b150a3b050b250b2b050565b5fa16101e01bb050b1b050565b6102a4a2a261027e565bb250b050a0a35263ffffffffa2166040a40152505050565b6102c5a16101e8565ba2525050565b5f60c0a201b0506102df5fa301a5a761029a565b6102ec6080a301a46102bc565bb4b350505050565b5f6040a2a4031215610309576103086101b3565b5b5f610316a4a2a501610229565bb15050b2b15050565b5f6040a201b0506103325fa301a46102bc565bb2b15050565b5fa151b050610346a1610213565bb2b15050565b5f6040a2a4031215610361576103606101b3565b5b5f61036ea4a2a501610338565bb15050b2b15050565b610381a2a261027e565bb250b050a0a35261039763ffffffffa31661028d565b6040a40152505050565b5f6103ada2a4a6610377565b6044a201b150a1b050b3b2505050565b5fa16101001bb050b1b050565b6103f37f4e487b71000000000000000000000000000000000000000000000000000000006103bd565b5f52601160045260445ffd5b5f610409a26101e8565bb150610414a36101e8565bb250a2a201b0507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa1111561044c5761044b6103ca565b5bb2b1505056fea2646970667358221220bbf58603e174ece9c2889f904e2c89cd12b06a141cfd3ac48c448dd5cac31f3b64687970637826302e322e302d646576656c6f702e323032362e392e322b636f6d6d69742e32623961306631640057';
