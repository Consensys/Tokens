module.exports = function(deployer) {
  deployer.deploy(HumanStandardToken, 10, "UpChain Coins", 0, "UPC");
  /*
  deployer.then(()=>{

    console.log('deploy new Token');
    return HumanStandardToken.new(
        100000, "Simon Bucks", 2, "SBX"
    );
  }).then(token => {
    console.log('token deployed ' + token.address);
  });
  */
};
