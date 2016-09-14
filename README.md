# Upchains Tokens

This repo contains Solidity smart contract code to issue simple, standards-compliant tokens on Ethereum. It can be used to create any form of asset, currency, coin, hours, usage tokens, vunk, etc.

The default is StandardToken.sol which ONLY implements the core ERC20 standard functionality #20.

HumanStandardToken.sol is an example of a token that has optional extras fit for your issuing your own tokens, to be mainly used by other humans. It includes:

1. Initial Finite Supply (upon creation one specifies how much is minted).
2. In the absence of a token registry: Optional Decimal, Symbol & Name.
3. Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

Installation

```bash
npm install
```

Test

```bash
truffle test
```

Serve

```bash
truffle test
```

Application acessible hia http://localhost:8080

## CORS / HTTPS Server Mode

* client checks if https is used
* For https:// the server assumes a node running on port 8546
* A X-API-HEADER can be added

* No error messages for "secure and non secure"
* quirky cors implementations (or spec writers) are even covered. Please give feedback about cors hickups

## Development workflow
Upchain Tokens Dapp built on Ethereum Standard Token.

  * "testrpc-snapshot": "./scripts/create-snapshot.sh",
  * "testrpc-revert": "./scripts/revert-snapshot.sh",
  * "jshint": "jshint app/javascripts",
  * "jscs": "jscs app/javascripts",
  * "lint": "npm run jshint && npm run jscs",
  * "pretest":"npm run testrpc-snapshot",
  * "posttest": "npm run testrpc-revert",
  * "test": "truffle test $NODE_DEBUG_OPTION",
  * "testrpc": "pm2 start testrpc",
  * "start": "pm2 start truffle -- serve"
