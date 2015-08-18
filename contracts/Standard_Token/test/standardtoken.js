contract("Standard_Token", function(accounts) {

    it("should create an initial balance of 10000 for the creator", function(done) {
        Standard_Token.new(10000, {from: accounts[0]}).then(function(ctr) {
            return ctr.coinBalance.call();
    }).then(function (result) {
        console.log(result);
        assert.strictEqual(result.c[0], 10000);
        done();
        }).catch(done);
    });
});
