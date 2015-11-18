contract("Standard_Token", function(accounts) {

    it("should create an initial balance of 10000 for the creator", function(done) {
        Standard_Token.new(10000, {from: accounts[0]}).then(function(ctr) {
            return ctr.balanceOf.call(accounts[0]);
    }).then(function (result) {
        assert.strictEqual(result.c[0], 10000);
        done();
        }).catch(done);
    });

    it("should transfer 2000 to accounts[1]", function(done) {
        var ctr;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer(accounts[1], 2000);
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            done();
        }).catch(done);
    });

    //approve
    it("should approve address of msg.sender", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.approve(accounts[1], {from: accounts[0]});
        }).then(function (result) {
            return ctr.isApprovedFor.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.isTrue(result);
            done();
        }).catch(done);
    });

    it("should approveOnce address of msg.sender", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.approveOnce(accounts[1], 10, {from: accounts[0]});
        }).then(function (result) {
            return ctr.isApprovedOnceFor.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 10);
            done();
        }).catch(done);
    });

    it("should allow withdrawal from accounts[1] with approveOnce", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer(accounts[1], 2000); //first give other account tokens
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            return ctr.approveOnce(accounts[0], 500, {from: accounts[1]});
        }).then(function (result) {
            return ctr.transferFrom(accounts[1], accounts[0], 500);
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 8500);
            done();
        }).catch(done);
    });

    it("should not allow excess withdrawal from accounts[1]", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer(accounts[1], 2000);
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            return ctr.approveOnce(accounts[0], 500, {from: accounts[1]});
        }).then(function (result) {
            return ctr.transferFrom(accounts[1], accounts[0], 501);
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 8000);
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            done();
        }).catch(done);
    });

    it("should not allow withdrawal from accounts[1]", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer(accounts[1], 2000);
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            return ctr.transferFrom(accounts[1], accounts[0], 500);
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 8000);
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            done();
        }).catch(done);
    });

});
