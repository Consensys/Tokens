const expectThrow = require('./utils').expectThrow;
const TestERC721ImplementationAbstraction = artifacts.require('TestERC721Implementation');
let ERC721;

contract('TestERC721Implementation', function (accounts) {
  beforeEach(async () => {
    //todo: deployment is OOG-ing.
    ERC721 = await TestERC721ImplementationAbstraction.new({gas: 4700000, from: accounts[0]});
  })

  it('creation: admin should be set', async () => {
    const admin = await ERC721.admin.call();
    assert.strictEqual(admin, accounts[0]);
  });

  //todo: add other tests
})
