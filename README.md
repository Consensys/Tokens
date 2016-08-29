# Upchains Tokens

## Dependencies

* Groovy

## Quirks

### Setup patched truffle

from [https://github.com/sebs/truffle](https://github.com/sebs/truffle)
which contains [https://github.com/sebs/truffle-default-builder](https://github.com/sebs/truffle-default-builder)

1. clone repo
2. npm install
3. npm install -g

**In order to deploy, the secure option must be set to false.
Additional headers are not yet patched into truffle.**

## CORS / HTTPS Server Mode

* deploy with options.rpc.secure = false
* serve with
  * options.rpc.secure = true
  * options.rpc.providerName
  * options.rpc.certificate: './cert/localhost.crt',
  * options.rpc.key: './cert/localhost.key'


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
