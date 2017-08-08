const HumanStandardTokenFactory =
  artifacts.require(`./HumanStandardTokenFactory.sol`)

module.exports = (deployer) => {
  deployer.deploy(HumanStandardTokenFactory)
}
