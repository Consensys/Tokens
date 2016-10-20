module.exports = function(deployer) {
//  deployer.deploy(Token);
//  deployer.autolink();
  deployer.deploy(StandardToken);
  deployer.autolink();
  deployer.deploy(HumanStandardToken);
  deployer.autolink();
  deployer.deploy(HumanStandardTokenFactory);
  deployer.autolink();
  deployer.deploy(SampleRecipientSuccess);
  deployer.autolink();
  deployer.deploy(SampleRecipientThrow);
  deployer.autolink();
  deployer.deploy(TokenTester);
};
