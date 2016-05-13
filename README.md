# Tokens

This repo contains Solidity smart contract code to issue simple, standards-compliant tokens on Ethereum. It can be used to create any form of asset, currency, coin, hours, usage tokens, vunk, etc.  

The default is StandardToken.sol which ONLY implements the core ERC20 standard functionality (https://github.com/ethereum/EIPs/issues/20).  
HumanStandardToken.sol is an example of a token that has optional extras fit for your issuing your own tokens, to be mainly used by other humans. It includes:  

1) Initial Finite Supply (upon creation one specifies how much is minted).  
2) In the absence of a token registry: Optional Decimal, Symbol & Name.  
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.  

There is a set of tests written for the HumanStandardToken.sol using the Truffle framework to do so.

Standards allows other contract developers to easily incorporate your token into their application (governance, exchanges, games, etc). It will be updated as often as possible.  

Pull requests are welcome! Please keep standards discussions to the EIP repos.

"You get a token, you get a token, everyone gets a token!" - Token the 3rd: the fun gerbil.  

Licensed under MIT.  
