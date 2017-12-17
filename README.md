# Tokens
[ ![Codeship Status for ConsenSys/Tokens](https://app.codeship.com/projects/ccf33380-4dfa-0135-cfa1-72c4965f7f14/status?branch=master)](https://app.codeship.com/projects/233433) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT) [![David](https://img.shields.io/david/expressjs/express.svg?style=flat-square)](https://david-dm.org/ConsenSys/Tokens) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)]() [![AirBNB](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat-square)](https://github.com/airbnb/javascript) [![GitHub issues](https://img.shields.io/github/issues/badges/shields.svg?style=flat-square)](https://github.com/ConsenSys/Tokens/issues)

This repo contains Solidity smart contract code to issue simple, standards-compliant tokens on Ethereum. It can be used to create any form of asset, currency, coin, hours, usage tokens, vunk, etc.  

The default is [StandardToken.sol](https://github.com/ConsenSys/Tokens/blob/master/contracts/StandardToken.sol) which ONLY implements the core ERC20 standard functionality [#20](https://github.com/ethereum/EIPs/issues/20).  

[HumanStandardToken.sol](https://github.com/ConsenSys/Tokens/blob/master/contracts/HumanStandardToken.sol) is an example of a token that has optional extras fit for your issuing your own tokens, to be mainly used by other humans. It includes:  

1. Initial Finite Supply (upon creation one specifies how much is minted).  
2. In the absence of a token registry: Optional Decimal, Symbol & Name.  
3. Optional approveAndCall() functionality to notify a contract if an approval() has occurred.  

There is a set of tests written for the HumanStandardToken.sol using the Truffle framework to do so.

Standards allows other contract developers to easily incorporate your token into their application (governance, exchanges, games, etc). It will be updated as often as possible.  

## Testing

```npm install```

For getting truffle-hdwallet-provider. Solidity tests have to still be written.

Uses Truffle 3.x.

## ethpm

This is published under tokens at ethpm.

## Contributing

**Pull requests are welcome! Please keep standards discussions to the EIP repos.**

When submitting a pull request, please do so to the `staging` branch. 
