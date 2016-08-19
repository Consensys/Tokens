module.exports = function(deployer) {
  deployer.deploy(HumanStandardToken, 100001, "UpChain Coins", 2, "UPC");
  // we need that log here ;)
  // nice point to hook up all sorts of things 
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
