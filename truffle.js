const HDWalletProvider = require('truffle-hdwallet-provider')
const fs = require('fs')

// First read in the secrets.json to get our mnemonic
let secrets
let mnemonic
if (fs.existsSync('secrets.json')) {
  secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'))
  mnemonic = secrets.mnemonic
} else {
  console.log('No secrets.json found. If you are trying to publish EPM ' +
              'this will fail. Otherwise, you can ignore this message!')
  mnemonic = ''
}

module.exports = {
  networks: {
    live: {
      network_id: 1, // Ethereum public network
      port: 8545,
      host: "localhost",
      from: "0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687",
      gas: 4000000,
      gasPrice: 8000000000,
    },
    ropsten: {
      network_id: '3',
      port: 8545,
      host: "localhost",
      from: "0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687"
    },
    testrpc: {
      network_id: 'default'
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,        
      gas: 0xfffffffffff,
      gasPrice: 0x01     
    },
  }
}
