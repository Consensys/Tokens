contract("TokenTester", function(accounts) {
    it("creates 10000 initial tokens", function(done) {
        var tester = TokenTester.at(TokenTester.deployed_address);
        tester.tokenContractAddress.call()
        .then(function(tokenContractAddr) {
            var tokenContract = Standard_Token.at(tokenContractAddr);
            return tokenContract.balanceOf.call(TokenTester.deployed_address);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 10000);  // 10000 as specified in TokenTester.sol
            done();
        }).catch(done);
    });
});
