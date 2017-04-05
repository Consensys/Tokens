var HumanStandardToken = artifacts.require("./HumanStandardToken.sol");

module.exports = function(deployer) {
  deployer.deploy(HumanStandardToken);
};
