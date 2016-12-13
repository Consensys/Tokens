module.exports = {
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
    "live": {
      network_id: 1, // Ethereum public network
      // optional config values
      // host - defaults to "localhost"
      // port - defaults to 8545
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
    },
    "morden": {
      network_id: 2,
      host: "https://morden.infura.io",
    },
    "testrpc": {
      network_id: "default"
    },
    "test": { //truffle test hardcodes the "test" network.
      network_id: "default",
    }
  }
};
