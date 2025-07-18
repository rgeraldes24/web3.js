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
	HexStringBytes,
	SignedTransactionInfoAPI,
	Transaction,
	TransactionSignedAPI,
	FMT_BYTES,
	FMT_NUMBER,
} from '@theqrl/web3-types';
import { decodeSignedTransaction } from '../../../../src/utils/decode_signed_transaction';

const rawType0x2Transaction: Transaction = {
	from: 'Z2086EA3853Acf31bDEaa7D46F34360e8996D95C5',
	type: '0x2',
	nonce: '0x0',
	maxFeePerGas: '0x3b9aca01',
	maxPriorityFeePerGas: '0x0',
	gasLimit: '0x5208',
	value: '0x1',
	input: '0x',
	to: 'Z0000000000000000000000000000000000000000',
	accessList: [
		{
			address: 'Zde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
			storageKeys: [
				'0x0000000000000000000000000000000000000000000000000000000000000003',
				'0x0000000000000000000000000000000000000000000000000000000000000007',
			],
		},
		{
			address: 'Zbb9bc244d798123fde783fcc1c72d3bb8c189413',
			storageKeys: [],
		},
	],
};
const signedType0x2Transaction: Transaction = {
	...rawType0x2Transaction,
	publicKey:
		'0xda218daf9d5457bee0e2381250f7ad3159e8a243fbf90e02c2802e1722cee954758875aa00c57adda2736030ea7fd293367c202298d7125f4ca8bd83d0ee8e8805f4a9f2d3915d507a581d59a80491575ed69ed994a6650ecf8902cb056a6d5f8b59a46905ab1c58094c2a5a388de306486dbc23bf268ffa272e010182e8e9e23c07f55a866e59195333a353aeddf3cd51c22f955c21977d3ee9e4ee6557f30edb5d2517c04f834f6825a7a162323cb8b679cb5d2089190aa3e3c486b4b9895987b47e1b475ccc4f25969bc95ac24d2fb3cfcda7330ff9f949ac06a2b7a7293ee8463dc38a9c55d4bb5d8f4904836c29764931b0c3f4d1257871b132b08ae249fb40b61bb75360298f15345d4868b7aa4f06c485b703f6db84d2d5e1e70412928d6c6454a2a019540c518243e18e17404dfd781a576a34e0f297bc4fa69532e717cb9cadc1feafe4c6a99e31cde842dc05fd19d8c7131d530e9ab22b1c621e9d4a2ffd444376f0e0847c0523f56f345669fe88bb28492ed23dc822f83be85eb035695eceb08fb24fab3fb6cd54ee5972d68664af9d3bb4213da1ee11e95070eb45d033777eccf9efe54f2f23bdd0fd64cd0b4bd311d941f108fa13166505944de90e25fe50d4d4be8118d316994b53bacb96c92a4f4048e10fb01d7a8e89d7d0ba37f58ba37e1c399fd1d5c2fd0ba1d30231432a0592d0e06b0a18f0decaa3ef39e88c6d70b42bcc80e28f633c99a89e411d300ff78c7bc93f910906bc9d9202f4ce3b9a1c37432b4df23e053297f81b965ca0b1f447e323a2e66c9ffb75ab1c8daa2a9b239bd87bed1990f4dbf9747005950aa73b6a74da306342a63dfb67d5042f16814f08bd3fda8b572e501ce0a03111f93c0c1d3655634435f1ffc3fc000bf133c926bc336304eea648a7a1c7ebdd65fa593d5c11990878b385499a394584702fe309073aa15420e0d0980165ae7213dae40890babb2bbd3f7abf648c9dc74feba7c0ec8f0525bf5744744b9f5b28f6ac7f234e4f425f4bbafb69714abd911dd0514fd53039c13f72b1074f6c5a229f9172628747079193592bf74ac9049c2aed7823e9522ffeffb7d84887808a5e0814407ebbf514301fb015a3f0fa0c79d3fea883901f3bfc493569a239156f29364a1b43aeb4c3dc6a975ba517e1a6e8ca66b60e4de5326d2d65d95783b050546c73edc37175bf2dac38109c4cc6711c4f6ce4b7af5313e1967161841c11cbbd4f998d5d6b6b1135c9c75616ec88393300c199a2d602f6b048302258c6bf8960434ba6d3d6108a9d8fe17569c1454aedaa7b383975f3ecf1565df1e007744b9474111756a9b4471475dac9e55bb5eb1df67329aa077c14bb8aebac457ad06744e6b67238e1416e14a1c8c84d7981bb42b41562b10b9ba86809f47d19bb2c6a8a9f88559a9a73fecc7f95d781501095fd0f7493ecb020b35b613e2c91db655a9c85ae893e4da69e1ad833fb40c285f09992dbb6b18f154b198af34e3088928102e618722412934ff0bff977d9195d3eb520f8edb7cb08ffc9eeb0f60d02d8272652e456fdd28392acb41ce12fadc83c70dd742abd2015805f2b3713995d1d99050f08f9f88366cf5870b827dadc5bd20fdeacd672df857330be4e1b96838a0d8e97859fd7127d355e51ff9a5e43697b3cedaa1d62dd3aabe28fef97eae5cfec98399bc66f7a34616f95dcebf7eb6563a9115c13c46a80d564e669af08ce600ba0fec9f15a9422b1da6c3995cbff0212626c118ddf77721d84c938200bc9618e7234e3137053eb16620942e9632684e73163f0daad57327999e800c226a09c7083581e3b647cbd61e42a986ecb52f8e64e4d3efdb3fb942ebf2d1638a5c567115e6d33436e2f515e15b903e727d22c1945c968fd1ba1d87093e7768b75cd6033f2826580e85bd7c96477a62b1956a8f7aaba88d7ae095812acc9b9c33a477f3f920e49c7443bba90561b7804f6fe2bba598103507c61365bc11aea34f9f84c0e3a902eb6df4c292aead67699a63c1f5a4b87beb14b2e45537841902764b459b90ba378aadfdcd125deb953413fec2e3e1e3b4f6e435ae84cc7951b996a03db7e49cd1ddeda2041c99eff5dc9c85ffa383852ba9f9dde80cfe8c0353a6faa24a5ae307b8bd863c14f6a9b5b75daf8534118131b3b32b8239f51f6d5123ced24e9bd251d208ca40fa97f9e47fa79f25ede38280a5206c10281a8d4a8459fb0fe9dece2cc61f1ced84e7b5744e59312e32de10c82be7f81264d3a775a04913ce7bb1f28c25037f4b3b2ad5790b3667c9e309234cd161c36f7a71a0145ff0a7c9c1b9bed601b4971696c1979ac3ae2418a842e50c33ed45fddd0e319e48f72583cb90a4b08a57983f63918352cbc6f0a6d345c845f0f2cfbebc25cef454dfcdde04966e63e37d0b2060a12bdedfe3758c5f38a3c7250271ce9dded0e2c37304bbf668add831f76902d42041b9e7a2d77e9e912980be070a0dd84f3523055a86d84b7d92282974ec8f411e26aa88286b6a1314ea9a0b3d3ab100947770238d6a714d0e2ac9a1b7b3cff7e54c33d8bf7a40972418dc7fb205d7c29a8ad0a269eb9f0874e1ae2d37485e9fac92bce8c267d2feaa63f1fe186ae0cd25b626246b2db984941fa6eeb2b2ab14a56aaf15da2458b591b4862173a917a404725b9fee25539b948b2e2c9c5f2a251e9f88cd301715aa221e710228a0e1c691e0ea91414d7ddc6cbe76b572dd904b8107e4472e5e0d694ec8e4cf29c79ca83206c9a8fcb8e77a1157b4f7c9a68ab41520b5e2c0c9af6d11109c259ab5dc8d1f87bc83ebeb4a8845519833e42883ad7b16752b2ffbdc53ececca688b97b431a33d4223dcc32be985ea66f255ae44df027713ae10120e3bcc2eac966d974cc6e69449e959d7eb783855f975d36a8a5d5889db3137b338cabba16284d87965493bb07cc5639bb017499d5a59049a65fd5a0a58568c8c93677491b45b3099dd3ab9527dcb9455d42e7c22278dd800187a8fa016ad0ae3a5737f5ac6fbec043576cf5298150daba87066fb20ee074dfbfb330f4d9321834b35b43e9448997b254e78e1f2c5a4d757e4dc5bfee53dedcc863c539273d7135b063b724bc0edf153fd1f2828866801673c068442b38bcf45ea3bc006b84aaef5e8cc1de1d00e10484b3a59546c4b729595bde6a7facb5e1f6a041dd52307ec9ca2d1ca891eca2e2f0803ddac1698d6cc07d4ee381c06e9d232676c1acfa03287000c44afdf6c1613fa3ae499acd852f8a43dee5f2f790ab6b56a3010d6f35b6d0d3d185540f21593b8d8e75c4938192706ae087555ebc1e48882f1ee46af8256964d7fd4fb9bb6ffa60f79036b17e46d7f210c25fb1690a748dcf33ae74b1f44290fe1a46b87333def13630cc17e7e1290593775b043f817e603675dd16ceb159b4ee6d43799c2ae23984465e0942a64e30da1271d5e6194585d3ecdfe2302d4cae4ca388a516184e333f0d87103ab6585a955be8c7708c338fe1775b04486721b008cf99fd1f6d1a0d1027d975b21086fd42d4037f7979eac9e22108432401aff3443c5aec62e5a7c44bcda3d0ccc0e1b56c611f69b84500d2649f852190eedd1eb9a121d476dd26f81c6a52859c1de36066e8ce44a9f2edf94717b0fe445caddb',
	signature:
		'0x0935c5706443302711732ba9885ca7bb6159c5dfb605c342c630bce9c4df9cba359818f330e3593c627a2020bc762b8dee97106effaca61b569a7f12b5b8c2f9a38ce92927ce3ecdad3c3521443347ea9f63c9fe448709002047f28671758100e5c94e4df05362b16138752bd5990604885ecc8eaa2d2466ebf538115370c72b5985c9f13ec04f762e3625fd433248a7f6efee01be7c22f1bfaa0f459396ad0255cc34d0b3e1e4c1a7b556ec9bf017e83bee29965f2fcf90e92c38fd99ec60fd4afa9eada645eb2bb7cb53b7e67211e8555a5fff6fe93257c975bc13a39681542eb5be699554f3b0ecb8b9e3d8adf0bfc5631355aaaa191dd45c26d0821cd71031a12338684a00a3dcf0cf1142a5185a73b8810cec81b521fed4452a76911a3e8cc06c5774d17cc45da74d6d40d0a17319970bc8920be220e1adf898eed27a5f2180b9df60164c9633dbdf748edc44bae0c117ee8650edd05158baeb9ffec06a413ab9ca6f484e7e68052a2f8721ec35f6c5dae005004dd4de715b142c1251fbc3810483b2dfdded14d98f7eeaf26a0f49673c6391610e413a58a6a49fa507e2fd5272e726a859d9b5ef7a3437e3af4c5001e7031ead37a048e32ae1cccaf1cace132722a26b4e7f88842a53e64c61a87d27c8070ad2757bc0db0338b774e54531aeb98e153e41dba39843c8d061fe487a38c6d5af11e8e699177bacff2458bb66eb5848c087de205589d99c63c011070e23696dc764b681625b54dc925b8d9b16246d8daaa910cc0ebd022b360e222f3a0c1ace07450e91de9dea8e3b6830370b1e21244ae71acaabf78571c202e59e6ad357afd8e7ddc9d1d9431f4efe4b75e8efd9a0805d91cb8b12f90d3e6e9c578c0932286438e49b4dedc3ea0a135c7cdbb3f383086bdec0328108c98c9eadade7a6b7132cfc2294c11c5caa2cb711f89ba9ced9cd4c8b89bfc1980bbe1d56385b4950fe00a2d48026de9f7a6a150f8a4e87b133ed70f894aca75960c0852abd8879051d0eabd1d9261a4dc785d8195a74819c4d9398fb4d2d9deb17bc8b63ee84100dacdaba9915a9305700fec4feae4452c53ab3868934ed02a629f79e96173d3d406b3d212e4caded40b9be7b5f377765a6e7db5c550641555251ac2ac0af8bf3b47fe5491bfe0119f7aea37f5131cbdd1d5e41c4fb3c77a720265e69c269587430fa4b5081dffe263a5fd45614258897fd454f2d15534337bcabe5538769015c2c135f3ddd27a67037d869b62ae57614f0dfec276ff9306e006a8933f303b587254609ced54432cafe59b7dd221fb84054ac080b710b2b476a2ce33130f03a817d2cead4fa151b083946ad680fe7d116f65581aefcfd8e3fbbd5657657a85230cff1e3e2f80381054d54c96e82a902bcfbcb60cf20d838f8fba4b74b482f8535554ab050715d008eaac85dab3c4919606a7f948f2e67f9ba41d023ec9c57d559fd1cfe56e6ea0e99c235c86010312c9d63d719ce73478c7a3b19b3fa0f7a5271771364f71a31875f56cc2bb567cbf874563891563d787a2033b3bfc7071cbb8b2ad7629446a132a23871486bad2bc1c7bf0ca4b217ede496907f71f0cc67318a533e259a5b5e6e6ad1e4b80ad62480103d525c9a9cf37e5408566eb8ef89ee2be6843397efd0959fd7cb0407b3700b2e0bf5cddf38d7d12f2a30637519babc7d2e22292ea868f2338dcc3bf63f4977439cd0984fec14de470ff940930be9614ae27d4a9c7d7e6430591e72997c3590a42538d5624eab37bf0f4bb84a66393b1f0f23bf0ac9fd439ede4eb58d4dc2aac5dc45865fc05493bc97d7df1d72cd6d0f56c90af76c9053432719cd8ace5838bd4d4592835aa4fc6466cfe43e60715cd8357a213449e1485ea058514e1ff539271a5434babf5d2f53d2ef82e2549a5e7ca68d6659e1b959e17cab4718ffa27119a3bc5238693d38c7fd1c4d3a66ddc643fb265ebd5f4b42457a64c7e20df6213285239a4aa1299708b304916cf3e3638c8dd3462add791d93c066e335beff662e43a899fee8bfa3902a94b0b8ee4c417935841dcb45207db1270ae584bfba4a1377e317cf6c868715b23877479c68b21c24e2e12bc9537aabd3093e5186f8a78acc393404a42b8a7e54e9fc7ad472e10d34cdb90ca8f94ed9484d37f517b465895643be2d26bb8130e553e7b55c66847671149567c34810b3c5f7f583eaeff39fca2c82ae5694d109b5bd5b9f24309df592d9bcac06e0818ad42de3b86cf52751244bf53e5e3dc2d47277ed6c0219d1dc3ed861462abc1df2759cc457e04971cc4aabef5a8798bd0b3805933fa73b15f437bd01f054d432dcc5f89a1a59efddedb8c78265d1765c3d538f1cca56611347a7a76d5fc1b28b48c2785008606a3b774461fbfd14204ca4d3a2b687424ade21489abecae340b10f0cc4e8a691f399a7a78cc573dc5a2e580845c8ea907f0c0a2145910e5c2eb9edf9230a94337572678cce9b33f48cafe61e494fe44c9ca24bc8c5b4a7f1cbce8a220f4b8d97156bc1cf91a43c1d71dde2dc621b77a3d94138d35b4d67f78e9c1c27127f4e8333039642f814398c21712eb0f3b27ea594fe81d8cc796bd4f8bdc1dabd916bef09bcf0bdf9034595d412675a4ace420f5105fa9ca1ecab8995bfb833d4d80f54bed43571aa411d8ba70f14cf361c549bf84e6d72a1a62e7272963221134620f87742804cb6868109aab31bba8f4520192e75ad39cb20375b2cac0e007662db7b0257c9f933aecc199b989eec8c716759458407f84b3e1dd0014db44309a46df72c996ef053090290e77c774722d0e52a8118256884bc0e782aab637c8312058cb3b85ad01186540e6d69b2d1586b523ec282fcb88a35928268c2003f87cb58b58bffbef4f636483bb06ad58fabefb958cf1bd4bec44d14be31c31aaa7cffa839161fc9be6e1a04f38ce2314ff5b3e039e6d6a3b4fb51ff0a30cce255048d467e27baf6cc2df950c0d629c9b352584d313291b38e5963e575f85bb1c00daf21b9dba8740bb842153a467e87f43983a8cf2691e9de3a52a6e13487faf8665ec639a60cb688426aad216d3f5b9feb89813a28979219ba6066842145b6775ed827023728685df857d190eac57d1acef555c9b1e30054364b730617a90c8582e5e6f66bfa245b0c53705530c6faa4011a0d5b94d15c65555437862ad6919f0182e038080fb3cfaa0224e40bb69403f8095bd744ec178f2855fa08f3e94e7dce2b64a4383da62809a8537efc0dbad167127eb170e69dabe6c142ea8a65aceca2a01c5e3f816d54e77cf08203d24752f7e99de231d08c3cf5f8481d7a94ce1ebc54f5121825a700eff0bb3577a604a0251bec7019a08918427bfd9e376cfa7b47d69fb888339bbca64b0b231f64d373b9137a1b1fe8115eb85447a6f3791e1f60f397128b60fb5a81fa713b712a6fc8e48dedf81c362c462749f77d2244ff8bf4d20fe40dffec34606e8e1faf9d1f67bf1990351564a4fc613bb1cf1f871e03dfe9a099c812aa349edc0fb581282ace5867d7ee1207cdaa261219cad381b446a6051422aace3eedcce741338b593b9c192ea3997886e88a0e38f5d346723cc0e94466f49d128f9d40d2f470551f3105ca0dfbea39db3748f6b6cee706a1e17783e228c3f0daa4b3e3f72ebe1923dc94f18a66119905ecb0f53fa15cbf305004a94d70ce5df8dedd76d071036e9bc99e76a345009cf5424cdbd7a877831408bfc4d6a3321e33bb0ac2fd81bc405bff83f7fc4b8e558af231d88fdde4ae4402c8b743964cd8d543378f6212ae6dd68b2e8efcb62d4a7d7cccf85eafcebfca7a1d06b0b7fa618f8ecd7c07cbe40183244aaeba1c37520d464f9d96dc392f3f7cbb806f12c2d867b94324d35854d7fca5454cabf5de6fc7225ac4965ca176f9fc8f1d62fc1b27a4768bd9d6a2bf7d10982a01d9e953d9ccb3b0f20e79a9963b365fe4fc7a70d9b88b223e889bdd3dc17a3dc8d195feb4f39cb59f590e464c8efcaa445a4d5ebc5501fd0e91040b639ce3b4b2574a3eabaa60cef9334b1a384da9930849f36e01b8c8dbdabde85c3b02eb6b209fbd57028432a17fbd3ef987d38ab4157f02a5578bee71ed0a28c58447dfb9f6f15647831c20dcb82499c3f1484b5f4b1bf0bb94b57b5483e1565020f134e15312dcfdbfa1c6af51b6d9f486d39977a96a53f028c2cc0bb8078ee21059dd44d455aeb51daf1579abe4c35e6f1251df752d26a42dee8c20d710b173b32c3990866d1683063cef6cd8ed1512e109207d421cdb7d7db8c9fa2797d6be3ee057b3207c86846db11cff0a29e07d23fe6a4eeae3943798a76acedb3d38797f6f094ee1ad6203a3353fb120811c3d18170a774b7809f311d404e861fc07a0c0fedd8c6f4529d401086b948d1f373c60883b23c0eb202a9f98e61b501b91bcdb9a20d18e62c060e21d192ec0924164a9d7bca22a6668ac07fb11500cd009cf80eb0ce8576470099123686ac16ad32184f124aeb8a6202fa58aa2b9adb0664307044ec969b4d2dc90102f6ac9757963b0da6bffbf5aaf7928006653ad9a8ea285948d00971ae4067efa7b37990ca1416cdbd689e950a5d3d61ed7c990915cdd97b8d273223df3ec242e6f5b48222f35059f301b28b876d114ad5dc26caa9964a509c9d4d82e966ea94ee9c2d5694304e37187dcdb58c3ccc4eee8e786b33f37c08204d5feee88a96127710bfbe00d63fb17b397210b11c508a5138d9a7d4f75ddaf882261ff1b02f05975e2757c70bdde9208ceaca0ef1ed4c7ecf2b3a2be1c1e11ab984f2dcc580dfbf03207032c10f682a19398b47d88940292f1a5bf780d6f8567f1169130742ad5cac9c42d546d6581b5df8ebd7d607ce465e6eeb9b12fd09a520d604a2ef348c2fbe7bb1f81551d67433b1d19438682ed0d46caf8fbe0d8ec10d85ca71a3095eb76d34461c8eb5a90d39f3c97b1f619bea1663befcaaecc97a9a08d4b335242319ded480d826dd35894f64c49cda13102d9aa126aeda4365accbc7bc6aca9a723537991273f41c09ecf009908b4f18de6729f6d16ff598a20bdd46dfb62ac08ee67ed91dfb8d992a14382293129d9971c6b9ebbb378c87ae9704fb976943e02abd29a7febc86e00488677d575d501bc3e8485c4b1d80a343e1aca737da8d9fdf589255a51fbe93efb84c43b76934675d63ee93e1234e299101b7b99b88f152340dd07fba2d97abae648173b2a58546159bb59e83561df55559bc6008255aeadaf56efd7035ec0dfe1bf45483224712b4c0328d78faa365694df862d75bedbf18d9737171351d1e7a19e8f3cf7a1e05357a728e711e7771d159e7712457af1a6b678f00758811a8f8507fb2dfe4253abbddb89553793d29a41cf2b64a5e824b78afffddcbf81342fa0877e0c88b9a97323e1102803ca2541bd28fb790b0821597d8661bd4fe524b7ecdada89a30cbaef2cba546145d6ea4b985aef676d13cdad1d13cd8d086c26cf60dcd8d33b21a4e7a8c5e9a1abaa5938282288f05fcd6143f3ad0c22b6c68bda5bf1df2ee6ca00dbddad99f5013125da578299fcd0ea8b040b2a0f854331355ed1e00489fbdf862a81aea97b1a417df3aa530f7843d66516eb997b1ec517eba23f80eb38c4cb7ad5e488081431425fcfc272584f3f24e29ee2023ae1c197c3d6f77d2ce54b5da9d4fb13e8aad9915d17afd2deb55bc6adcbcd717fba516ef6d79494c8e0efc4a85baa7a97891706e700f400d9d880707111f081f1af6d2ab9e3f375ac60ae923f9a1d92037b143b5d4bf238af35930b876f47afd3202a2279a8fcdef568fd192da1b8504ca9daea018c0c221acc76ddda58a0e373d0e63817ec36d026421b74b87bb5b159d9013879083a298e5385c3120e3b853816416c359d0e65050adc3b70627b084ad7149ab461db9e8335e602b903fbeccc2c12234f2b67a4d30fd2b7a19fc335b24c76f0e52e75539dfa2f7c4f00f8afbc442fa84cc2c830c0e935ba294c1392c874a369f75505093346170727a1fdbc7dedaa07df03d75d5ce5dfdd9acbf82c29c20d3151b7b99b47e9d085df2d14514df579739a6d25b825322108ed2da49e7c55f29f56ac490b6e1c6f8bd20fa9d979211d69523da1f1ed38b8208c622e755d6dc839b2816c3c377e5e3b8a4519cdded01995fc42464acfcd6823712884804629af7530a02a46798c8d28e0fd8cb05c8da263c576a881d1f7159301158b5093e30557e2d4496e35ff8dccb26d8fa29adc24456846acb017cc99e28eec9f47bc406c0963e3310d19f51f9b402ca86ec763ae7d5f96ed3d3cc281c4ab0fec7b0f7cca1e3b0f68fe144c37fef2537413c7963309b35ddb8837072d5a84161d2e4a5e9993aaf70eaaf00023434f97bcc0cdd1f5091547ace2ef0e2c31a0b4dd76829dadaeb4d9eef354658be6f30000000000000000000000000000000000000000000000000000000005080b151b212a2f',
};

const type0x2SignedTransactionInfo = {
	raw: '0x02f91cb18205398080843b9aca018252089400000000000000000000000000000000000000000180f872f85994de0b295669a9fd93d5f28d9ec85e40f4cb697baef842a00000000000000000000000000000000000000000000000000000000000000003a00000000000000000000000000000000000000000000000000000000000000007d694bb9bc244d798123fde783fcc1c72d3bb8c189413c0b90a20da218daf9d5457bee0e2381250f7ad3159e8a243fbf90e02c2802e1722cee954758875aa00c57adda2736030ea7fd293367c202298d7125f4ca8bd83d0ee8e8805f4a9f2d3915d507a581d59a80491575ed69ed994a6650ecf8902cb056a6d5f8b59a46905ab1c58094c2a5a388de306486dbc23bf268ffa272e010182e8e9e23c07f55a866e59195333a353aeddf3cd51c22f955c21977d3ee9e4ee6557f30edb5d2517c04f834f6825a7a162323cb8b679cb5d2089190aa3e3c486b4b9895987b47e1b475ccc4f25969bc95ac24d2fb3cfcda7330ff9f949ac06a2b7a7293ee8463dc38a9c55d4bb5d8f4904836c29764931b0c3f4d1257871b132b08ae249fb40b61bb75360298f15345d4868b7aa4f06c485b703f6db84d2d5e1e70412928d6c6454a2a019540c518243e18e17404dfd781a576a34e0f297bc4fa69532e717cb9cadc1feafe4c6a99e31cde842dc05fd19d8c7131d530e9ab22b1c621e9d4a2ffd444376f0e0847c0523f56f345669fe88bb28492ed23dc822f83be85eb035695eceb08fb24fab3fb6cd54ee5972d68664af9d3bb4213da1ee11e95070eb45d033777eccf9efe54f2f23bdd0fd64cd0b4bd311d941f108fa13166505944de90e25fe50d4d4be8118d316994b53bacb96c92a4f4048e10fb01d7a8e89d7d0ba37f58ba37e1c399fd1d5c2fd0ba1d30231432a0592d0e06b0a18f0decaa3ef39e88c6d70b42bcc80e28f633c99a89e411d300ff78c7bc93f910906bc9d9202f4ce3b9a1c37432b4df23e053297f81b965ca0b1f447e323a2e66c9ffb75ab1c8daa2a9b239bd87bed1990f4dbf9747005950aa73b6a74da306342a63dfb67d5042f16814f08bd3fda8b572e501ce0a03111f93c0c1d3655634435f1ffc3fc000bf133c926bc336304eea648a7a1c7ebdd65fa593d5c11990878b385499a394584702fe309073aa15420e0d0980165ae7213dae40890babb2bbd3f7abf648c9dc74feba7c0ec8f0525bf5744744b9f5b28f6ac7f234e4f425f4bbafb69714abd911dd0514fd53039c13f72b1074f6c5a229f9172628747079193592bf74ac9049c2aed7823e9522ffeffb7d84887808a5e0814407ebbf514301fb015a3f0fa0c79d3fea883901f3bfc493569a239156f29364a1b43aeb4c3dc6a975ba517e1a6e8ca66b60e4de5326d2d65d95783b050546c73edc37175bf2dac38109c4cc6711c4f6ce4b7af5313e1967161841c11cbbd4f998d5d6b6b1135c9c75616ec88393300c199a2d602f6b048302258c6bf8960434ba6d3d6108a9d8fe17569c1454aedaa7b383975f3ecf1565df1e007744b9474111756a9b4471475dac9e55bb5eb1df67329aa077c14bb8aebac457ad06744e6b67238e1416e14a1c8c84d7981bb42b41562b10b9ba86809f47d19bb2c6a8a9f88559a9a73fecc7f95d781501095fd0f7493ecb020b35b613e2c91db655a9c85ae893e4da69e1ad833fb40c285f09992dbb6b18f154b198af34e3088928102e618722412934ff0bff977d9195d3eb520f8edb7cb08ffc9eeb0f60d02d8272652e456fdd28392acb41ce12fadc83c70dd742abd2015805f2b3713995d1d99050f08f9f88366cf5870b827dadc5bd20fdeacd672df857330be4e1b96838a0d8e97859fd7127d355e51ff9a5e43697b3cedaa1d62dd3aabe28fef97eae5cfec98399bc66f7a34616f95dcebf7eb6563a9115c13c46a80d564e669af08ce600ba0fec9f15a9422b1da6c3995cbff0212626c118ddf77721d84c938200bc9618e7234e3137053eb16620942e9632684e73163f0daad57327999e800c226a09c7083581e3b647cbd61e42a986ecb52f8e64e4d3efdb3fb942ebf2d1638a5c567115e6d33436e2f515e15b903e727d22c1945c968fd1ba1d87093e7768b75cd6033f2826580e85bd7c96477a62b1956a8f7aaba88d7ae095812acc9b9c33a477f3f920e49c7443bba90561b7804f6fe2bba598103507c61365bc11aea34f9f84c0e3a902eb6df4c292aead67699a63c1f5a4b87beb14b2e45537841902764b459b90ba378aadfdcd125deb953413fec2e3e1e3b4f6e435ae84cc7951b996a03db7e49cd1ddeda2041c99eff5dc9c85ffa383852ba9f9dde80cfe8c0353a6faa24a5ae307b8bd863c14f6a9b5b75daf8534118131b3b32b8239f51f6d5123ced24e9bd251d208ca40fa97f9e47fa79f25ede38280a5206c10281a8d4a8459fb0fe9dece2cc61f1ced84e7b5744e59312e32de10c82be7f81264d3a775a04913ce7bb1f28c25037f4b3b2ad5790b3667c9e309234cd161c36f7a71a0145ff0a7c9c1b9bed601b4971696c1979ac3ae2418a842e50c33ed45fddd0e319e48f72583cb90a4b08a57983f63918352cbc6f0a6d345c845f0f2cfbebc25cef454dfcdde04966e63e37d0b2060a12bdedfe3758c5f38a3c7250271ce9dded0e2c37304bbf668add831f76902d42041b9e7a2d77e9e912980be070a0dd84f3523055a86d84b7d92282974ec8f411e26aa88286b6a1314ea9a0b3d3ab100947770238d6a714d0e2ac9a1b7b3cff7e54c33d8bf7a40972418dc7fb205d7c29a8ad0a269eb9f0874e1ae2d37485e9fac92bce8c267d2feaa63f1fe186ae0cd25b626246b2db984941fa6eeb2b2ab14a56aaf15da2458b591b4862173a917a404725b9fee25539b948b2e2c9c5f2a251e9f88cd301715aa221e710228a0e1c691e0ea91414d7ddc6cbe76b572dd904b8107e4472e5e0d694ec8e4cf29c79ca83206c9a8fcb8e77a1157b4f7c9a68ab41520b5e2c0c9af6d11109c259ab5dc8d1f87bc83ebeb4a8845519833e42883ad7b16752b2ffbdc53ececca688b97b431a33d4223dcc32be985ea66f255ae44df027713ae10120e3bcc2eac966d974cc6e69449e959d7eb783855f975d36a8a5d5889db3137b338cabba16284d87965493bb07cc5639bb017499d5a59049a65fd5a0a58568c8c93677491b45b3099dd3ab9527dcb9455d42e7c22278dd800187a8fa016ad0ae3a5737f5ac6fbec043576cf5298150daba87066fb20ee074dfbfb330f4d9321834b35b43e9448997b254e78e1f2c5a4d757e4dc5bfee53dedcc863c539273d7135b063b724bc0edf153fd1f2828866801673c068442b38bcf45ea3bc006b84aaef5e8cc1de1d00e10484b3a59546c4b729595bde6a7facb5e1f6a041dd52307ec9ca2d1ca891eca2e2f0803ddac1698d6cc07d4ee381c06e9d232676c1acfa03287000c44afdf6c1613fa3ae499acd852f8a43dee5f2f790ab6b56a3010d6f35b6d0d3d185540f21593b8d8e75c4938192706ae087555ebc1e48882f1ee46af8256964d7fd4fb9bb6ffa60f79036b17e46d7f210c25fb1690a748dcf33ae74b1f44290fe1a46b87333def13630cc17e7e1290593775b043f817e603675dd16ceb159b4ee6d43799c2ae23984465e0942a64e30da1271d5e6194585d3ecdfe2302d4cae4ca388a516184e333f0d87103ab6585a955be8c7708c338fe1775b04486721b008cf99fd1f6d1a0d1027d975b21086fd42d4037f7979eac9e22108432401aff3443c5aec62e5a7c44bcda3d0ccc0e1b56c611f69b84500d2649f852190eedd1eb9a121d476dd26f81c6a52859c1de36066e8ce44a9f2edf94717b0fe445caddbb911f30935c5706443302711732ba9885ca7bb6159c5dfb605c342c630bce9c4df9cba359818f330e3593c627a2020bc762b8dee97106effaca61b569a7f12b5b8c2f9a38ce92927ce3ecdad3c3521443347ea9f63c9fe448709002047f28671758100e5c94e4df05362b16138752bd5990604885ecc8eaa2d2466ebf538115370c72b5985c9f13ec04f762e3625fd433248a7f6efee01be7c22f1bfaa0f459396ad0255cc34d0b3e1e4c1a7b556ec9bf017e83bee29965f2fcf90e92c38fd99ec60fd4afa9eada645eb2bb7cb53b7e67211e8555a5fff6fe93257c975bc13a39681542eb5be699554f3b0ecb8b9e3d8adf0bfc5631355aaaa191dd45c26d0821cd71031a12338684a00a3dcf0cf1142a5185a73b8810cec81b521fed4452a76911a3e8cc06c5774d17cc45da74d6d40d0a17319970bc8920be220e1adf898eed27a5f2180b9df60164c9633dbdf748edc44bae0c117ee8650edd05158baeb9ffec06a413ab9ca6f484e7e68052a2f8721ec35f6c5dae005004dd4de715b142c1251fbc3810483b2dfdded14d98f7eeaf26a0f49673c6391610e413a58a6a49fa507e2fd5272e726a859d9b5ef7a3437e3af4c5001e7031ead37a048e32ae1cccaf1cace132722a26b4e7f88842a53e64c61a87d27c8070ad2757bc0db0338b774e54531aeb98e153e41dba39843c8d061fe487a38c6d5af11e8e699177bacff2458bb66eb5848c087de205589d99c63c011070e23696dc764b681625b54dc925b8d9b16246d8daaa910cc0ebd022b360e222f3a0c1ace07450e91de9dea8e3b6830370b1e21244ae71acaabf78571c202e59e6ad357afd8e7ddc9d1d9431f4efe4b75e8efd9a0805d91cb8b12f90d3e6e9c578c0932286438e49b4dedc3ea0a135c7cdbb3f383086bdec0328108c98c9eadade7a6b7132cfc2294c11c5caa2cb711f89ba9ced9cd4c8b89bfc1980bbe1d56385b4950fe00a2d48026de9f7a6a150f8a4e87b133ed70f894aca75960c0852abd8879051d0eabd1d9261a4dc785d8195a74819c4d9398fb4d2d9deb17bc8b63ee84100dacdaba9915a9305700fec4feae4452c53ab3868934ed02a629f79e96173d3d406b3d212e4caded40b9be7b5f377765a6e7db5c550641555251ac2ac0af8bf3b47fe5491bfe0119f7aea37f5131cbdd1d5e41c4fb3c77a720265e69c269587430fa4b5081dffe263a5fd45614258897fd454f2d15534337bcabe5538769015c2c135f3ddd27a67037d869b62ae57614f0dfec276ff9306e006a8933f303b587254609ced54432cafe59b7dd221fb84054ac080b710b2b476a2ce33130f03a817d2cead4fa151b083946ad680fe7d116f65581aefcfd8e3fbbd5657657a85230cff1e3e2f80381054d54c96e82a902bcfbcb60cf20d838f8fba4b74b482f8535554ab050715d008eaac85dab3c4919606a7f948f2e67f9ba41d023ec9c57d559fd1cfe56e6ea0e99c235c86010312c9d63d719ce73478c7a3b19b3fa0f7a5271771364f71a31875f56cc2bb567cbf874563891563d787a2033b3bfc7071cbb8b2ad7629446a132a23871486bad2bc1c7bf0ca4b217ede496907f71f0cc67318a533e259a5b5e6e6ad1e4b80ad62480103d525c9a9cf37e5408566eb8ef89ee2be6843397efd0959fd7cb0407b3700b2e0bf5cddf38d7d12f2a30637519babc7d2e22292ea868f2338dcc3bf63f4977439cd0984fec14de470ff940930be9614ae27d4a9c7d7e6430591e72997c3590a42538d5624eab37bf0f4bb84a66393b1f0f23bf0ac9fd439ede4eb58d4dc2aac5dc45865fc05493bc97d7df1d72cd6d0f56c90af76c9053432719cd8ace5838bd4d4592835aa4fc6466cfe43e60715cd8357a213449e1485ea058514e1ff539271a5434babf5d2f53d2ef82e2549a5e7ca68d6659e1b959e17cab4718ffa27119a3bc5238693d38c7fd1c4d3a66ddc643fb265ebd5f4b42457a64c7e20df6213285239a4aa1299708b304916cf3e3638c8dd3462add791d93c066e335beff662e43a899fee8bfa3902a94b0b8ee4c417935841dcb45207db1270ae584bfba4a1377e317cf6c868715b23877479c68b21c24e2e12bc9537aabd3093e5186f8a78acc393404a42b8a7e54e9fc7ad472e10d34cdb90ca8f94ed9484d37f517b465895643be2d26bb8130e553e7b55c66847671149567c34810b3c5f7f583eaeff39fca2c82ae5694d109b5bd5b9f24309df592d9bcac06e0818ad42de3b86cf52751244bf53e5e3dc2d47277ed6c0219d1dc3ed861462abc1df2759cc457e04971cc4aabef5a8798bd0b3805933fa73b15f437bd01f054d432dcc5f89a1a59efddedb8c78265d1765c3d538f1cca56611347a7a76d5fc1b28b48c2785008606a3b774461fbfd14204ca4d3a2b687424ade21489abecae340b10f0cc4e8a691f399a7a78cc573dc5a2e580845c8ea907f0c0a2145910e5c2eb9edf9230a94337572678cce9b33f48cafe61e494fe44c9ca24bc8c5b4a7f1cbce8a220f4b8d97156bc1cf91a43c1d71dde2dc621b77a3d94138d35b4d67f78e9c1c27127f4e8333039642f814398c21712eb0f3b27ea594fe81d8cc796bd4f8bdc1dabd916bef09bcf0bdf9034595d412675a4ace420f5105fa9ca1ecab8995bfb833d4d80f54bed43571aa411d8ba70f14cf361c549bf84e6d72a1a62e7272963221134620f87742804cb6868109aab31bba8f4520192e75ad39cb20375b2cac0e007662db7b0257c9f933aecc199b989eec8c716759458407f84b3e1dd0014db44309a46df72c996ef053090290e77c774722d0e52a8118256884bc0e782aab637c8312058cb3b85ad01186540e6d69b2d1586b523ec282fcb88a35928268c2003f87cb58b58bffbef4f636483bb06ad58fabefb958cf1bd4bec44d14be31c31aaa7cffa839161fc9be6e1a04f38ce2314ff5b3e039e6d6a3b4fb51ff0a30cce255048d467e27baf6cc2df950c0d629c9b352584d313291b38e5963e575f85bb1c00daf21b9dba8740bb842153a467e87f43983a8cf2691e9de3a52a6e13487faf8665ec639a60cb688426aad216d3f5b9feb89813a28979219ba6066842145b6775ed827023728685df857d190eac57d1acef555c9b1e30054364b730617a90c8582e5e6f66bfa245b0c53705530c6faa4011a0d5b94d15c65555437862ad6919f0182e038080fb3cfaa0224e40bb69403f8095bd744ec178f2855fa08f3e94e7dce2b64a4383da62809a8537efc0dbad167127eb170e69dabe6c142ea8a65aceca2a01c5e3f816d54e77cf08203d24752f7e99de231d08c3cf5f8481d7a94ce1ebc54f5121825a700eff0bb3577a604a0251bec7019a08918427bfd9e376cfa7b47d69fb888339bbca64b0b231f64d373b9137a1b1fe8115eb85447a6f3791e1f60f397128b60fb5a81fa713b712a6fc8e48dedf81c362c462749f77d2244ff8bf4d20fe40dffec34606e8e1faf9d1f67bf1990351564a4fc613bb1cf1f871e03dfe9a099c812aa349edc0fb581282ace5867d7ee1207cdaa261219cad381b446a6051422aace3eedcce741338b593b9c192ea3997886e88a0e38f5d346723cc0e94466f49d128f9d40d2f470551f3105ca0dfbea39db3748f6b6cee706a1e17783e228c3f0daa4b3e3f72ebe1923dc94f18a66119905ecb0f53fa15cbf305004a94d70ce5df8dedd76d071036e9bc99e76a345009cf5424cdbd7a877831408bfc4d6a3321e33bb0ac2fd81bc405bff83f7fc4b8e558af231d88fdde4ae4402c8b743964cd8d543378f6212ae6dd68b2e8efcb62d4a7d7cccf85eafcebfca7a1d06b0b7fa618f8ecd7c07cbe40183244aaeba1c37520d464f9d96dc392f3f7cbb806f12c2d867b94324d35854d7fca5454cabf5de6fc7225ac4965ca176f9fc8f1d62fc1b27a4768bd9d6a2bf7d10982a01d9e953d9ccb3b0f20e79a9963b365fe4fc7a70d9b88b223e889bdd3dc17a3dc8d195feb4f39cb59f590e464c8efcaa445a4d5ebc5501fd0e91040b639ce3b4b2574a3eabaa60cef9334b1a384da9930849f36e01b8c8dbdabde85c3b02eb6b209fbd57028432a17fbd3ef987d38ab4157f02a5578bee71ed0a28c58447dfb9f6f15647831c20dcb82499c3f1484b5f4b1bf0bb94b57b5483e1565020f134e15312dcfdbfa1c6af51b6d9f486d39977a96a53f028c2cc0bb8078ee21059dd44d455aeb51daf1579abe4c35e6f1251df752d26a42dee8c20d710b173b32c3990866d1683063cef6cd8ed1512e109207d421cdb7d7db8c9fa2797d6be3ee057b3207c86846db11cff0a29e07d23fe6a4eeae3943798a76acedb3d38797f6f094ee1ad6203a3353fb120811c3d18170a774b7809f311d404e861fc07a0c0fedd8c6f4529d401086b948d1f373c60883b23c0eb202a9f98e61b501b91bcdb9a20d18e62c060e21d192ec0924164a9d7bca22a6668ac07fb11500cd009cf80eb0ce8576470099123686ac16ad32184f124aeb8a6202fa58aa2b9adb0664307044ec969b4d2dc90102f6ac9757963b0da6bffbf5aaf7928006653ad9a8ea285948d00971ae4067efa7b37990ca1416cdbd689e950a5d3d61ed7c990915cdd97b8d273223df3ec242e6f5b48222f35059f301b28b876d114ad5dc26caa9964a509c9d4d82e966ea94ee9c2d5694304e37187dcdb58c3ccc4eee8e786b33f37c08204d5feee88a96127710bfbe00d63fb17b397210b11c508a5138d9a7d4f75ddaf882261ff1b02f05975e2757c70bdde9208ceaca0ef1ed4c7ecf2b3a2be1c1e11ab984f2dcc580dfbf03207032c10f682a19398b47d88940292f1a5bf780d6f8567f1169130742ad5cac9c42d546d6581b5df8ebd7d607ce465e6eeb9b12fd09a520d604a2ef348c2fbe7bb1f81551d67433b1d19438682ed0d46caf8fbe0d8ec10d85ca71a3095eb76d34461c8eb5a90d39f3c97b1f619bea1663befcaaecc97a9a08d4b335242319ded480d826dd35894f64c49cda13102d9aa126aeda4365accbc7bc6aca9a723537991273f41c09ecf009908b4f18de6729f6d16ff598a20bdd46dfb62ac08ee67ed91dfb8d992a14382293129d9971c6b9ebbb378c87ae9704fb976943e02abd29a7febc86e00488677d575d501bc3e8485c4b1d80a343e1aca737da8d9fdf589255a51fbe93efb84c43b76934675d63ee93e1234e299101b7b99b88f152340dd07fba2d97abae648173b2a58546159bb59e83561df55559bc6008255aeadaf56efd7035ec0dfe1bf45483224712b4c0328d78faa365694df862d75bedbf18d9737171351d1e7a19e8f3cf7a1e05357a728e711e7771d159e7712457af1a6b678f00758811a8f8507fb2dfe4253abbddb89553793d29a41cf2b64a5e824b78afffddcbf81342fa0877e0c88b9a97323e1102803ca2541bd28fb790b0821597d8661bd4fe524b7ecdada89a30cbaef2cba546145d6ea4b985aef676d13cdad1d13cd8d086c26cf60dcd8d33b21a4e7a8c5e9a1abaa5938282288f05fcd6143f3ad0c22b6c68bda5bf1df2ee6ca00dbddad99f5013125da578299fcd0ea8b040b2a0f854331355ed1e00489fbdf862a81aea97b1a417df3aa530f7843d66516eb997b1ec517eba23f80eb38c4cb7ad5e488081431425fcfc272584f3f24e29ee2023ae1c197c3d6f77d2ce54b5da9d4fb13e8aad9915d17afd2deb55bc6adcbcd717fba516ef6d79494c8e0efc4a85baa7a97891706e700f400d9d880707111f081f1af6d2ab9e3f375ac60ae923f9a1d92037b143b5d4bf238af35930b876f47afd3202a2279a8fcdef568fd192da1b8504ca9daea018c0c221acc76ddda58a0e373d0e63817ec36d026421b74b87bb5b159d9013879083a298e5385c3120e3b853816416c359d0e65050adc3b70627b084ad7149ab461db9e8335e602b903fbeccc2c12234f2b67a4d30fd2b7a19fc335b24c76f0e52e75539dfa2f7c4f00f8afbc442fa84cc2c830c0e935ba294c1392c874a369f75505093346170727a1fdbc7dedaa07df03d75d5ce5dfdd9acbf82c29c20d3151b7b99b47e9d085df2d14514df579739a6d25b825322108ed2da49e7c55f29f56ac490b6e1c6f8bd20fa9d979211d69523da1f1ed38b8208c622e755d6dc839b2816c3c377e5e3b8a4519cdded01995fc42464acfcd6823712884804629af7530a02a46798c8d28e0fd8cb05c8da263c576a881d1f7159301158b5093e30557e2d4496e35ff8dccb26d8fa29adc24456846acb017cc99e28eec9f47bc406c0963e3310d19f51f9b402ca86ec763ae7d5f96ed3d3cc281c4ab0fec7b0f7cca1e3b0f68fe144c37fef2537413c7963309b35ddb8837072d5a84161d2e4a5e9993aaf70eaaf00023434f97bcc0cdd1f5091547ace2ef0e2c31a0b4dd76829dadaeb4d9eef354658be6f30000000000000000000000000000000000000000000000000000000005080b151b212a2f',
	tx: signedType0x2Transaction as TransactionSignedAPI,
};

export const returnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - transaction
 * 	   - SignedTransactionInfoAPI or HexStringBytes (i.e. SignedTransactionInfoAPI.raw)
 *     - Formatted SignedTransactionInfoAPI
 */
type TestData = [
	string,
	[Transaction, SignedTransactionInfoAPI | HexStringBytes, SignedTransactionInfoAPI],
];
export const testData: TestData[] = [
	[
		JSON.stringify(rawType0x2Transaction),
		[
			rawType0x2Transaction,
			type0x2SignedTransactionInfo,
			decodeSignedTransaction(type0x2SignedTransactionInfo.raw, returnFormat, {
				fillInputAndData: true,
			}),
		],
	],
	[
		JSON.stringify(rawType0x2Transaction),
		[
			rawType0x2Transaction,
			type0x2SignedTransactionInfo.raw,
			decodeSignedTransaction(type0x2SignedTransactionInfo.raw, returnFormat, {
				fillInputAndData: true,
			}),
		],
	],
];
