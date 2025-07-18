# Zond ABI Coder

This sub-module is a fork of the [ethers project](https://github.com/ethers-io/ethers.js).

It is responsible for encoding and decoding the Application Binary Interface (ABI)
used by most Zond smart contracts to interoperate between other smart contracts and clients.

More information, can be inferred from the [ethers project documentation](https://docs.ethers.io/v5/api/utils/abi/).

## Importing

```javascript
const {
	ConstructorFragment,
	EventFragment,
	Fragment,
	FunctionFragment,
	ParamType,
	FormatTypes,

	AbiCoder,
	defaultAbiCoder,

	Interface,
	Indexed,

	/////////////////////////
	// Types

	CoerceFunc,
	JsonFragment,
	JsonFragmentType,

	Result,
	checkResultErrors,

	LogDescription,
	TransactionDescription,
} = require('@theqrl/abi');
```

## License

MIT License
