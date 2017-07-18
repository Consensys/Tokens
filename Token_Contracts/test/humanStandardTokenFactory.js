var HumanStandardTokenFactory = artifacts.require('./HumanStandardTokenFactory.sol')

contract('HumanStandardTokenFactory', function (accounts) {
  it('Verify a Human Standard Token once deployed using both verification functions.', function () {
    var factory = null
    var newTokenAddr = null
    return HumanStandardTokenFactory.new().then(function (ctr) {
      factory = ctr
      return factory.createHumanStandardToken.call(100000, 'Simon Bucks', 2, 'SBX', {from: accounts[0]})
    }).then(function (tokenContractAddr) {
      newTokenAddr = tokenContractAddr
      return factory.verifyHumanStandardToken.call(newTokenAddr, {from: accounts[0]})
    }).then(function (res) {
      assert.strictEqual(res, true)
    }).catch((err) => { throw new Error(err) })
  })
})
