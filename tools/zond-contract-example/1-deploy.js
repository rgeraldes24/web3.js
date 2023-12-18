const config = require("./config.json");

// Check for config requirements
if(config.hexseed == "hexseed_here") {
    console.log("You need a to enter a dilithium hexseed for this to work.");
    process.exit(1);
}

const BN = require('bn.js');
const ethUtil = require('ethereumjs-util')
const { Web3 } = require('@theqrl/web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.provider))
const { seedToAccount } = require('@theqrl/web3-zond-accounts');
const contractCompiler = require("./contract-compiler");
require("./qrllib/qrllib-js.js")


/* Load Dilithium Wallet */
// Replace this hexseed with your own Dilithium wallet
const hexSeed = config.hexseed
// let d = dilithium.NewFromSeed(hexSeed)

// Deploy contract
const deploy = async () => {
    // NOTE(rgeraldes24) - this is not returning the expected address
    // let address = d.GetAddress()
    const acc = seedToAccount(hexSeed)

    // Get solidity compiled contract output
    let output = contractCompiler.GetCompilerOutput()

    const inputABI = output.contracts['MyToken.sol']['MyToken'].abi
    let contractByteCode = output.contracts['MyToken.sol']['MyToken'].evm.bytecode.object

    let contract = new web3.zond.Contract(inputABI)

    let contractSend = contract.deploy({data: contractByteCode, arguments: ["TOKEN123", "TOK"]})

    // This gives you the latest available nonce for the account
    let nonce = await web3.zond.getTransactionCount(acc.address)
    
    const estimatedGas = await contractSend.estimateGas({"from": acc.address})

    const createTransaction = await web3.zond.accounts.signTransaction(
        {
            from: acc.address,
            data: contractSend.encodeABI(),
            nonce: nonce,
            chainId: '0x7E7E', // NOTE(rgeraldes24) - you might have to use a different one
            value: 0,
            to: '',
            // type 2 tx fields
            gas: estimatedGas,
            maxFeePerGas: '0x1229298c00',
			maxPriorityFeePerGas: '0x49504f80',
        },
        acc.seed
        );

    console.log('Attempting to deploy from account:', acc.address);
    await web3.zond.sendSignedTransaction(
        createTransaction.rawTransaction
        ).on('receipt', console.log)
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("confirmation no: ", confirmationNumber)
        });

    const deployedContractAddress = Web3.utils.bytesToHex(ethUtil.generateAddress(Buffer.from(acc.address.slice(2), 'hex'), new BN(nonce).toBuffer()))
    console.log("Expected contract address ", Web3.utils.toChecksumAddress(deployedContractAddress))
};
deploy();
