contract("Standard_Token", function(accounts) {

/*CREATION*/

    it("creation: should create an initial balance of 10000 for the creator", function(done) {
        Standard_Token.new(10000, {from: accounts[0]}).then(function(ctr) {
            return ctr.balanceOf.call(accounts[0]);
    }).then(function (result) {
        assert.strictEqual(result.c[0], 10000);
        done();
        }).catch(done);
    });

    it("creation: should succeed in creating over 2^256 - 1 (max) tokens", function(done) {
        //2^256 - 1
        Standard_Token.new('115792089237316195423570985008687907853269984665640564039457584007913129639935', {from: accounts[0]}).then(function(ctr) {
            return ctr.totalSupply();
    }).then(function (result) {
        var match = result.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77');
        assert.isTrue(match);
        done();
        }).catch(done);
    });

/*TRANSERS*/
//normal transfers without approvals.

    it("transfers: should transfer 10000 to accounts[1] with accounts[0] having 10000", function(done) {
        var ctr;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer(accounts[1], 10000, {from: accounts[0]});
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 10000);
            done();
        }).catch(done);
    });

    it("transfers: should fail when trying to transfer 10001 to accounts[1] with accounts[0] having 10000", function(done) {
        var ctr;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer.call(accounts[1], 10001, {from: accounts[0]});
        }).then(function (result) {
            assert.isFalse(result);
            done();
        }).catch(done);
    });

    it("transfers: should fail when trying to transfer zero.", function(done) {
        var ctr;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transfer.call(accounts[1], 0, {from: accounts[0]});
        }).then(function (result) {
            assert.isFalse(result);
            done();
        }).catch(done);
    });

    //NOTE: testing uint256 wrapping is impossible in this standard token since you can't supply > 2^256 -1.

    //todo: transfer max amounts.

/*APPROVALS*/

    it("approvals: msg.sender should approve 100 to accounts[1]", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 100);
            done();
        }).catch(done);
    });

    //bit overkill. But is for testing a bug
    it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 10000);
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function (result) {
            return ctr.balanceOf.call(accounts[2]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 0);
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 100);
            return ctr.transferFrom.call(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then(function (result) {
            return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 80);
            return ctr.balanceOf.call(accounts[2]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 20);
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 9980);
            done();
        }).catch(done);
    });

    //should approve 100 of msg.sender & withdraw 50, twice. (should succeed)
    it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 100);
            return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 80);
            return ctr.balanceOf.call(accounts[2]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 20);
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 9980);
            //FIRST tx done.
            //onto next.
            return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 60);
            return ctr.balanceOf.call(accounts[2]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 40);
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 9960);
            done();
        }).catch(done);
    });

    //should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
    it("approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 100);
            return ctr.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]});
        }).then(function (result) {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 50);
            return ctr.balanceOf.call(accounts[2]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 50);
            return ctr.balanceOf.call(accounts[0]);
        }).then(function (result) {
            assert.strictEqual(result.c[0], 9950);
            //FIRST tx done.
            //onto next.
            return ctr.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
        }).then(function (result) {
            assert.isFalse(result);
            done();
        }).catch(done);
    });

    it("approvals: attempt withdrawal from acconut with no allowance (should fail)", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
        }).then(function (result) {
              assert.isFalse(result);
              done();
        }).catch(done);
    });

    it("approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then unapprove.", function(done) {
        var ctr = null;
        Standard_Token.new(10000, {from: accounts[0]}).then(function(result) {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then(function (result) {
            return ctr.transferFrom(accounts[0], accounts[2], 60, {from: accounts[1]});
        }).then(function (result) {
            return ctr.unapprove(accounts[1], {from: accounts[0]});
        }).then(function (result) {
            return ctr.transferFrom.call(accounts[0], accounts[2], 10, {from: accounts[1]});
        }).then(function (result) {
              assert.isFalse(result);
              done();
        }).catch(done);
    });


    //todo, max approvals.

});
