//This currently throws a stack underflow, and thus commented out. Contract is correctly deployed, but createHumanStandardToken throws underflow.
//Replicated under testrpc and debugging to fix this.
var HumanStandardTokenFactory = artifacts.require("./HumanStandardTokenFactory.sol");

contract("HumanStandardTokenFactory", function(accounts) {

    it("Verify a Human Standard Token once deployed using both verification functions.", function(done) {
        var factory = null;
        var newTokenAddr = null;
        HumanStandardTokenFactory.new().then(function(ctr) {
        factory = ctr;

        return factory.createHumanStandardToken.call(100000, "Simon Bucks", 2, "SBX", {from: accounts[0]});
        }).then(function(tokenContractAddr) {
            newTokenAddr = tokenContractAddr;
            return factory.createHumanStandardToken(100000, "Simon Bucks", 2, "SBX", {from: accounts[0]});
        }).then(function(result) {
            return factory.verifyHumanStandardToken.call(newTokenAddr, {from: accounts[0]});
        }).then(function (result) {
            assert.strictEqual(result, true);
            return factory.isHumanToken.call(newTokenAddr, {from: accounts[0]});
        }).then(function (result) {
            assert.strictEqual(result, true);
            done();
        }).catch(done);
    });
});
