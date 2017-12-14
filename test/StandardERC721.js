// const expectThrow = require('./utils').expectThrow
const TestERC721ImplementationAbstraction = artifacts.require('TestERC721Implementation')
let ERC721

contract('TestERC721Implementation', function (accounts) {
  beforeEach(async () => {
    // todo: deployment is OOG-ing.
    ERC721 = await TestERC721ImplementationAbstraction.new({gas: 6700000, from: accounts[0]})
  })

  it('creation: admin should be set', async () => {
    const admin = await ERC721.admin.call()
    assert.strictEqual(admin, accounts[0])
  })

  // create tokens:
  // create one token to admin (verify events too: from == 0)
  // create one token to other user
  // create multiple tokens to one user
  // create multiple tokens to multiple users

  // burn tokens:
  // create one token and burn/remove it.
  // create 2 tokens to one user and then burn/remove one.
  // create 2 token to one user then burn one and then create new one to same user.
  // create 2 token to one user and then burn/remove all.

  // todo: possible to get balance of < 0? Should remove check this?

  // transfer token:
  // transfer token successfully (check all expected states)
  // transfer token to oneself
  // transfer token fail by token not exisitng
  // transfer token fail by sending to zero ("burning")
  // transfer token fail by not being owner


  // approve token:
  // approve token successfully (check all expected states)
  // approve token fail by token not exisitng
  // approve token fail by not being owner
  // approve token fail by approving owner

  // approve token successfully then transferFrom
  // approve token successfully then takeOwnership
  // approve token successfully then fail transferFrom by token not existing
  // approve token successfully then fail transferFrom by transferring to zero

  // todo: more tests
})
