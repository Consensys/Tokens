const HumanStandardTokenFactory = artifacts.require('HumanStandardTokenFactory')

contract('HumanStandardTokenFactory', function (accounts) {
  it('Verify a Human Standard Token once deployed using both verification functions.', async () => {
    const factory = await HumanStandardTokenFactory.new()
    const newTokenAddr = await factory.createHumanStandardToken.call(100000, 'Simon Bucks', 2, 'SBX', {from: accounts[0]})
    await factory.createHumanStandardToken(100000, 'Simon Bucks', 2, 'SBX', {from: accounts[0]})
    const res = await factory.verifyHumanStandardToken.call(newTokenAddr, {from: accounts[0]})
    assert(res, 'Could not verify the token.')
  })
})
