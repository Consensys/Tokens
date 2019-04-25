const EIP20 = artifacts.require('./EIP20.sol');

module.exports = (deployer) => {
  // 420,000,000 eBudz
  deployer.deploy(EIP20, '420000000000000000000000000', 'eBudz', 18, 'EBUD');
};
