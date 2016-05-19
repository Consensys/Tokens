//currently commented out as TokenTester is causing a OOG error due to the Factory being too big
//Not fully needed as factory & separate tests cover token creation.

/*contract("TokenTester", function(accounts) {
    it("creates 10000 initial tokens", function(done) {
        var tester = TokenTester.at(TokenTester.deployed_address);
        tester.tokenContractAddress.call()
        .then(function(tokenContractAddr) {
            var tokenContract = HumanStandardToken.at(tokenContractAddr);
            return tokenContract.balanceOf.call(TokenTester.deployed_address);
        }).then(function (result) {
            assert.strictEqual(result.toNumber(), 10000);  // 10000 as specified in TokenTester.sol
            done();
        }).catch(done);
    });

    //todo:add test on retrieving addresses
});*/
