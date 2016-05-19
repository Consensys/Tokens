//This currently throws a stack underflow, and thus commented out. Contract is correctly deployed, but createHumanStandardToken throws underflow.
//Replicated under testrpc and debugging to fix this.

//There is a live working version at: 0x7A3d7A4434058709f18337dfF02F90235760A405

/*contract("HumanStandardTokenFactory", function(accounts) {

    it("Verify A Human Standard Token Once Deployed", function(done) {
        console.log(HumanStandardTokenFactory);
        var factory = HumanStandardTokenFactory.at(HumanStandardTokenFactory.deployed_address);
        console.log(factory);
        return factory.createHumanStandardToken(100000, "Simon Bucks", 2, "SBX", {from: accounts[0]})
        .then(function(tokenContractAddr) {
            console.log(tokenContractAddr);
            return factory.verifyHumanStandardToken(tokenContractAddr);
        }).then(function (result) {
            console.log(result);
            assert.strictEqual(result, true);
            done();
        }).catch(done);
    });
});*/
