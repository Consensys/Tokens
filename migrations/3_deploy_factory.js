const EIP20Factory =
  artifacts.require('./EIP20Factory.sol');

module.exports = (deployer) => {
  deployer.deploy(EIP20Factory);
};
