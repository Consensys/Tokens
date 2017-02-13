# Tokens

This repo contains Solidity smart contract code to issue simple, standards-compliant tokens on Ethereum. It can be used to create any form of asset, currency, coin, hours, usage tokens, vunk, etc.  

The default is StandardToken.sol which ONLY implements the core ERC20 standard functionality [#20](https://github.com/ethereum/EIPs/issues/20).  

HumanStandardToken.sol is an example of a token that has optional extras fit for your issuing your own tokens, to be mainly used by other humans. It includes:  

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

### Pull requests are welcome! Please keep standards discussions to the EIP repos.

> "You get a token, you get a token, everyone gets a token!" - Token the 3rd: the fun gerbil.  

### Licensed under MIT.  

This code is licensed under MIT.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
