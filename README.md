# Tokens
[ ![Codeship Status for ConsenSys/Tokens](https://app.codeship.com/projects/ccf33380-4dfa-0135-cfa1-72c4965f7f14/status?branch=master)](https://app.codeship.com/projects/233433) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT) [![David](https://img.shields.io/david/expressjs/express.svg?style=flat-square)](https://david-dm.org/ConsenSys/Tokens) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)]() [![AirBNB](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat-square)](https://github.com/airbnb/javascript) [![GitHub issues](https://img.shields.io/github/issues/ConsenSys/Tokens/shields.svg?style=flat-square)](https://github.com/ConsenSys/Tokens/issues)

This repo contains Solidity smart contract code for simple, standards-compliant tokens on Ethereum. Adhering to standards allows other contract developers to easily incorporate your token into their applications.

The repo currently implements [EIP20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md) tokens, and more may be added in the future.

## Initialize
The only environmental dependency you need is Node. Presently we can guarantee this all works with Node 8.
```
npm install
npm run compile
```

## Tests
The repo has a comprehensive test suite. You can run it with `npm run test`.

## ethpm
The contracts in this repo are published under `tokens` on EPM. EPM is the recommended means of consuming token contracts in this repo. Copy-pasting code is highly discouraged.

## Contributing
Pull requests are welcome! Please keep standards discussions to the EIP repos.

When submitting a pull request, please do so to the `staging` branch. For a pull request to be accepted, they must pass the test suite. If a pull request adds features, it should add test coverage for those features.

