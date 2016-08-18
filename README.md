# Upchains Tokens

## Dependencies

* Groovy


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
