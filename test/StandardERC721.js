import assertRevert from './assertRevert'
const TestERC721ImplementationAbstraction = artifacts.require('TestERC721Implementation')
let ERC721

contract('TestERC721Implementation', function (accounts) {
  beforeEach(async () => {
    ERC721 = await TestERC721ImplementationAbstraction.new({gas: 6720000, from: accounts[0]})
  })

  it('creation: admin should be set', async () => {
    const admin = await ERC721.admin.call()
    assert.strictEqual(admin, accounts[0])
  })

  // create tokens:
  // create one token to admin
  it('creation: create one token', async () => {
    const admin = await ERC721.admin.call()
    const result = await ERC721.createToken(admin, { from: accounts[0] })

    // verify Transfer event (from == 0 if creating token)
    assert.strictEqual(result.logs[0].event, 'Transfer')
    assert.strictEqual(result.logs[0].args.from, '0x0000000000000000000000000000000000000000')
    assert.strictEqual(result.logs[0].args.to, admin)
    assert.strictEqual(result.logs[0].args.tokenId.toString(), '0')

    const totalSupply = await ERC721.totalSupply.call()
    const adminBalance = await ERC721.balanceOf.call(admin)
    const ownedTokens = await ERC721.getAllTokens.call(admin)
    const owner = await ERC721.ownerOf.call(0)

    assert.strictEqual(totalSupply.toString(), '1')
    assert.strictEqual(adminBalance.toString(), '1')
    assert.strictEqual(ownedTokens[0].toString(), '0')
    assert.strictEqual(admin, owner)
  })

  // retrieve token that doesn't exist (fail)
  it('creation: create one token then retrieve one that does not exist (should fail)', async () => {
    const admin = await ERC721.admin.call()
    await ERC721.createToken(admin, { from: accounts[0] })

    const owner = await ERC721.ownerOf.call(0)
    assert.strictEqual(admin, owner)
    await assertRevert(ERC721.ownerOf.call(1))
  })

  // create one token to other user
  it('creation: create one token to another user', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    const owner = await ERC721.ownerOf.call(0)
    assert.strictEqual(owner, accounts[1])
  })

  // create multiple tokens to one user
  it('creation: create multiple tokens to one user', async () => {
    await ERC721.createToken(accounts[0], { from: accounts[0] })
    await ERC721.createToken(accounts[0], { from: accounts[0] })

    const user1 = await ERC721.ownerOf.call(0)
    const user2 = await ERC721.ownerOf.call(1)
    assert.strictEqual(user1, accounts[0])
    assert.strictEqual(user2, accounts[0])
  })

  // create multiple tokens to multiple users
  it('creation: create multiple tokens to multiple users', async () => {
    await ERC721.createToken(accounts[0], { from: accounts[0] })
    await ERC721.createToken(accounts[0], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    const user1 = await ERC721.ownerOf.call(0)
    const user2 = await ERC721.ownerOf.call(1)
    const user3 = await ERC721.ownerOf.call(2)
    const user4 = await ERC721.ownerOf.call(3)
    assert.strictEqual(user1, accounts[0])
    assert.strictEqual(user2, accounts[0])
    assert.strictEqual(user3, accounts[1])
    assert.strictEqual(user4, accounts[1])
  })

  // burn tokens:
  // create one token and burn/remove it.
  it('burn: create one token the burn/remove it', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    const burn = await ERC721.burnToken(0, { from: accounts[1] })
    // verify Transfer event (to == 0 if burning token)
    assert.strictEqual(burn.logs[0].event, 'Transfer')
    assert.strictEqual(burn.logs[0].args.from, accounts[1])
    assert.strictEqual(burn.logs[0].args.to, '0x0000000000000000000000000000000000000000')
    assert.strictEqual(burn.logs[0].args.tokenId.toString(), '0')

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])

    assert.strictEqual(totalSupply.toString(), '0')
    assert.strictEqual(balance.toString(), '0')
    assert.strictEqual(ownedTokens.length, 0)
    await assertRevert(ERC721.ownerOf.call(0))
  })

  // create one token and burn/remove a different one (should fail).
  it('burn: create one token and burn/remove a different ID (should fail)', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.burnToken(1, { from: accounts[1] }))
  })

  // burn from other owner (should fail)
  it('burn: create one token and burn/remove from a different owner (should fail)', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.burnToken(0, { from: accounts[2] }))
  })

  // create 2 tokens to one user and then burn/remove one.
  it('creation: create 2 tokens to one user and then burn/remove one (second token).', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.burnToken(1, { from: accounts[1] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])
    const owner = await ERC721.ownerOf.call(0)

    assert.strictEqual(totalSupply.toString(), '1')
    assert.strictEqual(balance.toString(), '1')
    assert.strictEqual(ownedTokens.length, 1)
    assert.strictEqual(owner, accounts[1])
    await assertRevert(ERC721.ownerOf.call(1))
  })

  // create 2 token to one user then burn one and then create new one to same user.
  it('creation: create 2 token to one user then burn one and then create new one to same user.', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.burnToken(1, { from: accounts[1] })

    await ERC721.createToken(accounts[1], { from: accounts[0] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])
    const owner = await ERC721.ownerOf.call(0)
    const owner2 = await ERC721.ownerOf.call(2)

    assert.strictEqual(totalSupply.toString(), '2')
    assert.strictEqual(balance.toString(), '2')
    assert.strictEqual(ownedTokens.length, 2)
    assert.strictEqual(owner, accounts[1])
    assert.strictEqual(owner2, accounts[1])
    await assertRevert(ERC721.ownerOf.call(1))
  })

  it('creation: create 3 tokens to one user and then remove middle token.', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.burnToken(1, { from: accounts[1] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])
    const owner = await ERC721.ownerOf.call(0)
    const owner2 = await ERC721.ownerOf.call(2)

    assert.strictEqual(totalSupply.toString(), '2')
    assert.strictEqual(balance.toString(), '2')
    assert.strictEqual(ownedTokens.length, 2)
    assert.strictEqual(owner, accounts[1])
    assert.strictEqual(owner2, accounts[1])
    await assertRevert(ERC721.ownerOf.call(1))
  })

  it('creation: create 3 tokens to one user and then remove first token.', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.burnToken(0, { from: accounts[1] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])
    const owner = await ERC721.ownerOf.call(1)
    const owner2 = await ERC721.ownerOf.call(2)

    assert.strictEqual(totalSupply.toString(), '2')
    assert.strictEqual(balance.toString(), '2')
    assert.strictEqual(ownedTokens.length, 2)
    assert.strictEqual(owner, accounts[1])
    assert.strictEqual(owner2, accounts[1])
    await assertRevert(ERC721.ownerOf.call(0))
  })

  it('creation: create 3 tokens to one user and then remove last token.', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.burnToken(2, { from: accounts[1] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])
    const owner = await ERC721.ownerOf.call(0)
    const owner2 = await ERC721.ownerOf.call(1)

    assert.strictEqual(totalSupply.toString(), '2')
    assert.strictEqual(balance.toString(), '2')
    assert.strictEqual(ownedTokens.length, 2)
    assert.strictEqual(owner, accounts[1])
    assert.strictEqual(owner2, accounts[1])
    await assertRevert(ERC721.ownerOf.call(2))
  })

  // create 3 token to one user and then burn/remove all.
  it('creation: create 3 tokens to one user and then burn/remove all.', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.burnToken(0, { from: accounts[1] })
    await ERC721.burnToken(1, { from: accounts[1] })
    await ERC721.burnToken(2, { from: accounts[1] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])

    assert.strictEqual(totalSupply.toString(), '0')
    assert.strictEqual(balance.toString(), '0')
    assert.strictEqual(ownedTokens.length, 0)
    await assertRevert(ERC721.ownerOf.call(0))
    await assertRevert(ERC721.ownerOf.call(1))
    await assertRevert(ERC721.ownerOf.call(2))
  })

  // todo: possible to get balance of < 0? Should remove check this?

  // transfer token:
  // transfer token successfully (check all expected states)
  it('transer: transfer token successfully', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    const result = await ERC721.transfer(accounts[2], 0, { from: accounts[1] })

    // verify Transfer event
    assert.strictEqual(result.logs[0].event, 'Transfer')
    assert.strictEqual(result.logs[0].args.from, accounts[1])
    assert.strictEqual(result.logs[0].args.to, accounts[2])
    assert.strictEqual(result.logs[0].args.tokenId.toString(), '0')

    const totalSupply = await ERC721.totalSupply.call()

    const balance1 = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens1 = await ERC721.getAllTokens.call(accounts[1])

    const balance2 = await ERC721.balanceOf.call(accounts[2])
    const ownedTokens2 = await ERC721.getAllTokens.call(accounts[2])

    const owner = await ERC721.ownerOf.call(0)

    assert.strictEqual(totalSupply.toString(), '1')

    assert.strictEqual(balance1.toString(), '0')
    assert.strictEqual(ownedTokens1.length, 0)

    assert.strictEqual(balance2.toString(), '1')
    assert.strictEqual(ownedTokens2.length, 1)

    assert.strictEqual(owner, accounts[2])
  })

  // transfer token to oneself (should be allowed)
  it('transer: transfer token to oneself (should be allowed)', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.transfer(accounts[1], 0, { from: accounts[1] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens = await ERC721.getAllTokens.call(accounts[1])

    const owner = await ERC721.ownerOf.call(0)

    assert.strictEqual(totalSupply.toString(), '1')

    assert.strictEqual(balance.toString(), '1')
    assert.strictEqual(ownedTokens.length, 1)

    assert.strictEqual(owner, accounts[1])
  })

  // transfer token fail by token not exisitng
  it('transer: transfer token fail by token not exisitng', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.transfer(accounts[1], 1, { from: accounts[1] }))
  })

  // transfer token fail by sending to zero ("burning")
  it('transer: transfer token fail by token sending to zero', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.transfer(0, 0, { from: accounts[1] }))
  })

  // transfer token fail by not being owner
  it('transer: transfer token fail by not being owner', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.transfer(accounts[2], 0, { from: accounts[3] }))
  })

  // approve token:
  // approve token successfully (check all expected states)
  it('approve: approve token successfully', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    const approve = await ERC721.approve(accounts[2], 0, { from: accounts[1] })

    // verify Approval event
    assert.strictEqual(approve.logs[0].event, 'Approval')
    assert.strictEqual(approve.logs[0].args.owner, accounts[1])
    assert.strictEqual(approve.logs[0].args.approved, accounts[2])
    assert.strictEqual(approve.logs[0].args.tokenId.toString(), '0')

    const allowed = await ERC721.allowed.call(0)
    assert.strictEqual(allowed, accounts[2])
  })

  // approve token and then clear TODO

  // approve token fail by token not exisitng
  it('approve: approve token failure by tokens not existing', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.approve(accounts[2], 1, { from: accounts[1] }))
    await assertRevert(ERC721.approve(accounts[2], 2, { from: accounts[1] }))
  })

  // approve token fail by not being owner
  it('approve: approve token fail by not being owner', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.approve(accounts[2], 0, { from: accounts[3] }))
  })

  // approve token fail by approving owner
  it('approve: approve token fail by approving same owner', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await assertRevert(ERC721.approve(accounts[1], 0, { from: accounts[1] }))
  })

  // approve token successfully then transferFrom
  it('approve: create token to 1, approve token to 2, then successfully then transferFrom to other account 3', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    const transferFrom = await ERC721.transferFrom(accounts[1], accounts[3], 0, { from: accounts[2] })

    // verify Approval events (clears approval)
    assert.strictEqual(transferFrom.logs[0].event, 'Approval')
    assert.strictEqual(transferFrom.logs[0].args.owner, accounts[1])
    assert.strictEqual(transferFrom.logs[0].args.approved, '0x0000000000000000000000000000000000000000')
    assert.strictEqual(transferFrom.logs[0].args.tokenId.toString(), '0')

    // verify Transfer events
    assert.strictEqual(transferFrom.logs[1].event, 'Transfer')
    assert.strictEqual(transferFrom.logs[1].args.from, accounts[1])
    assert.strictEqual(transferFrom.logs[1].args.to, accounts[3])
    assert.strictEqual(transferFrom.logs[1].args.tokenId.toString(), '0')

    const totalSupply = await ERC721.totalSupply.call()
    const balance1 = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens1 = await ERC721.getAllTokens.call(accounts[1])

    const balance2 = await ERC721.balanceOf.call(accounts[3])
    const ownedTokens2 = await ERC721.getAllTokens.call(accounts[3])

    const owner = await ERC721.ownerOf.call(0)
    const allowed = await ERC721.allowed.call(0)

    assert.strictEqual(totalSupply.toString(), '1')

    assert.strictEqual(balance1.toString(), '0')
    assert.strictEqual(ownedTokens1.length, 0)
    assert.strictEqual(balance2.toString(), '1')
    assert.strictEqual(ownedTokens2.length, 1)

    assert.strictEqual(owner, accounts[3])

    assert.strictEqual(allowed, '0x0000000000000000000000000000000000000000')
  })

  it('approve: create token to 1, approve token to 2, then successfully then transferFrom to approved account 2 (eg manual takeOwnership)', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    await ERC721.transferFrom(accounts[1], accounts[2], 0, { from: accounts[2] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance1 = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens1 = await ERC721.getAllTokens.call(accounts[1])

    const balance2 = await ERC721.balanceOf.call(accounts[2])
    const ownedTokens2 = await ERC721.getAllTokens.call(accounts[2])

    const owner = await ERC721.ownerOf.call(0)
    const allowed = await ERC721.allowed.call(0)

    assert.strictEqual(totalSupply.toString(), '1')

    assert.strictEqual(balance1.toString(), '0')
    assert.strictEqual(ownedTokens1.length, 0)
    assert.strictEqual(balance2.toString(), '1')
    assert.strictEqual(ownedTokens2.length, 1)

    assert.strictEqual(owner, accounts[2])

    assert.strictEqual(allowed, '0x0000000000000000000000000000000000000000')
  })

  it('approve: create 2 tokens to 1, approve tokens to 2, then successfully then transferFrom 1 to account 3', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    await ERC721.approve(accounts[2], 1, { from: accounts[1] })
    await ERC721.transferFrom(accounts[1], accounts[3], 0, { from: accounts[2] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance1 = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens1 = await ERC721.getAllTokens.call(accounts[1])

    const balance2 = await ERC721.balanceOf.call(accounts[3])
    const ownedTokens2 = await ERC721.getAllTokens.call(accounts[3])

    const owner1 = await ERC721.ownerOf.call(0)
    const owner2 = await ERC721.ownerOf.call(1)
    const allowed1 = await ERC721.allowed.call(0)
    const allowed2 = await ERC721.allowed.call(1)

    assert.strictEqual(totalSupply.toString(), '2')

    assert.strictEqual(balance1.toString(), '1')
    assert.strictEqual(ownedTokens1.length, 1)
    assert.strictEqual(balance2.toString(), '1')
    assert.strictEqual(ownedTokens2.length, 1)

    assert.strictEqual(owner1, accounts[3])
    assert.strictEqual(owner2, accounts[1])

    assert.strictEqual(allowed1, '0x0000000000000000000000000000000000000000')
    assert.strictEqual(allowed2, accounts[2])
  })

  // approve token successfully then takeOwnership
  it('approve: approve token successfully then takeOwnership', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    await ERC721.takeOwnership(0, { from: accounts[2] })

    const totalSupply = await ERC721.totalSupply.call()
    const balance1 = await ERC721.balanceOf.call(accounts[1])
    const ownedTokens1 = await ERC721.getAllTokens.call(accounts[1])

    const balance2 = await ERC721.balanceOf.call(accounts[2])
    const ownedTokens2 = await ERC721.getAllTokens.call(accounts[2])

    const owner = await ERC721.ownerOf.call(0)
    const allowed = await ERC721.allowed.call(0)

    assert.strictEqual(totalSupply.toString(), '1')

    assert.strictEqual(balance1.toString(), '0')
    assert.strictEqual(ownedTokens1.length, 0)
    assert.strictEqual(balance2.toString(), '1')
    assert.strictEqual(ownedTokens2.length, 1)

    assert.strictEqual(owner, accounts[2])

    assert.strictEqual(allowed, '0x0000000000000000000000000000000000000000')
  })

  // approve token successfully then fail transferFrom by token not existing
  it('approve: approve token successfully then fail transferFrom by token not existing', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    await assertRevert(ERC721.transferFrom(accounts[1], accounts[3], 1, { from: accounts[2] }))
  })

  // approve token successfully then fail transferFrom by different owner
  it('approve: approve token successfully then fail transferFrom by different owner', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    await assertRevert(ERC721.transferFrom(accounts[1], accounts[3], 0, { from: accounts[3] }))
  })

  // approve token successfully then fail transferFrom by transferring to zero
  it('approve: approve token successfully then fail transferFrom by transferring to zero', async () => {
    await ERC721.createToken(accounts[1], { from: accounts[0] })

    await ERC721.approve(accounts[2], 0, { from: accounts[1] })
    await assertRevert(ERC721.transferFrom(accounts[1], 0, 0, { from: accounts[2] }))
  })

  // todo: probably needs more tests around transfers + approvals.
})
