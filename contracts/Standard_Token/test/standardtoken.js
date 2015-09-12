contract("Standard_Token", function(accounts) {

    it("should create an initial balance of 10000 for the creator", function(done) {
        Standard_Token.new(10000, {from: accounts[0]}).then(function(ctr) {
            return ctr.coinBalance.call();
    }).then(function (result) {
        //console.log(result);
        assert.strictEqual(result.c[0], 10000);
        done();
        }).catch(done);
    });


    //coinBalanceOf (morph into top test)
    it("should return balance of any address", function(done) {
        Standard_Token.new(10000, {from: accounts[0]}).then(function(ctr) {
            return ctr.coinBalanceOf.call(accounts[0]);
    }).then(function (result) {
        assert.strictEqual(result.c[0], 10000);
        done();
        }).catch(done);
    });

    it("should sendCoin to accounts[1]", function(done) {
        var ctr;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.sendCoin(2000, accounts[1]);
        }).then(function (result) {
            return ctr.coinBalanceOf.call(accounts[1]);
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
            return ctr.isApproved.call(accounts[1], {from: accounts[0]});
        }).then(function (result) {
            assert.isTrue(result);
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
            return ctr.isApproved.call(accounts[1], {from: accounts[0]});
        }).then(function (result) {
            assert.isTrue(result);
            return ctr.isApprovedFor.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.isTrue(result);
            done();
        }).catch(done);
    });

    it("should allow withdrawal from accounts[1] with approveOnce", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.sendCoin(2000, accounts[1]);
        }).then(function (result) {
            return ctr.coinBalanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            return ctr.approveOnce(accounts[0], 500, {from: accounts[1]});
        }).then(function (result) {
            return ctr.sendCoinFrom(accounts[1], 500, accounts[0]);
        }).then(function (result) {
            return ctr.coinBalanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 8500);
            done();
        }).catch(done);
    });

    it("should not allow withdrawal from accounts[1]", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.sendCoin(2000, accounts[1]);
        }).then(function (result) {
            return ctr.coinBalanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            return ctr.sendCoinFrom(accounts[1], 500, accounts[0]);
        }).then(function (result) {
            return ctr.coinBalanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 8000);
            return ctr.coinBalanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 2000);
            done();
        }).catch(done);
    });


    /*TEST TODO*

    unapprove
    should unapprove all if approvedOnce of msg.sender for proxy
    should unapprove all if approve of msg.sender for proxy

    sendCoin
    should not transfer if value exceeds balance
    should transfer if sending exact balance

    sendCoinFrom
    should return false if value exceeds balance
    should transfer if msg.sender is proxy.
    should transfer is msg.sender is proxy & exact balance.

    */
});
