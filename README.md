# DEPRECATED

We recommend using the thoroughly vetted OpenZeppelin token implementations. 

# Tokens

[ ![Codeship Status for ConsenSys/Tokens](https://app.codeship.com/projects/ccf33380-4dfa-0135-cfa1-72c4965f7f14/status?branch=master)](https://app.codeship.com/projects/233433) [![Coverage Status](https://coveralls.io/repos/github/ConsenSys/Tokens/badge.svg?branch=coverage_test)](https://coveralls.io/github/ConsenSys/Tokens?branch=coverage_test) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT) [![David](https://img.shields.io/david/expressjs/express.svg?style=flat-square)](https://david-dm.org/ConsenSys/Tokens) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)]() [![AirBNB](https://img.shields.io/badge/code%20style-airbnb-brightgreen.svg?style=flat-square)](https://github.com/airbnb/javascript) [![GitHub issues](https://img.shields.io/github/issues/ConsenSys/Tokens/shields.svg?style=flat-square)](https://github.com/ConsenSys/Tokens/issues) 

This repo contains Solidity smart contract code for simple, standards-compliant tokens on Ethereum. Adhering to standards allows other contract developers to easily incorporate your token into their applications.

The repo currently implements [EIP20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md) tokens, and more may be added in the future.

## Guiding Principles
While other projects provide custom and feature-complete token implementations, the contracts found in this repository attempt to suit a slightly different purpose: to serve as the baseline reference implementations of token standards and to capture their essence. We strive to eschew bells and whistles and instead provide minimalist implementations that maximize learning and provide sturdy foundations. Contracts shall be thoroughly documented, detailing the implementation's rationale and evolution as it has been used across production-grade projects.

Here are the guiding principles for this repository:

1. *Simplicity:* Our contracts shall be simple, keeping functionality to a minimum of what is necessary to implement the token standard.
2. *Readability:* Solutions that make sense to humans should be prioritized over those heavily optimized or complex. 
3. *Secure:* Modifications to the master branch will only be accepted after thorough review and scrutinization from the community, the project maintainers, and at least one professional vendor to ensure no security vulnerabilities are introduced.

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

