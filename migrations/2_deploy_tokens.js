const HumanStandardToken = artifacts.require(`./HumanStandardToken.sol`)

module.exports = (deployer) => {
  deployer.deploy(HumanStandardToken)
}
