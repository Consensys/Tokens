const { assertRevert } = require('../helpers/assertRevert');

const testEip721 = artifacts.require('TestEIP721Implementation');
const testReceiver = artifacts.require('TestReceiver');
const TestNonStandardReceiver = artifacts.require('TestNonStandardReceiver');
let nft;
let admin;

// NOTE: This disable is for all the event logs args having underscores
/* eslint-disable no-underscore-dangle */

contract('TestEIP72Implementation', (accounts) => {
  beforeEach(async () => {
    nft = await testEip721.new({ gas: 6720000, from: accounts[0] });
    admin = await nft.admin.call();
  });

  it('creation: create one token', async () => {
    const result = await nft.createToken(admin, { from: accounts[0] });

    // verify Transfer event (from == 0 if creating token)
    assert.strictEqual(result.logs[0].event, 'Transfer');
    assert.strictEqual(result.logs[0].args._from, '0x0000000000000000000000000000000000000000');
    assert.strictEqual(result.logs[0].args._to, admin);
    assert.strictEqual(result.logs[0].args._tokenId.toString(), '10');

    const totalSupply = await nft.totalSupply.call();
    const adminBalance = await nft.balanceOf.call(admin);
    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(totalSupply.toString(), '1');
    assert.strictEqual(adminBalance.toString(), '1');
    assert.strictEqual(admin, owner);
  });

  it('creation: create one token then retrieve one that does not exist (should fail)', async () => {
    await nft.createToken(admin, { from: accounts[0] });

    const owner = await nft.ownerOf.call(10);
    assert.strictEqual(admin, owner);
    await assertRevert(nft.ownerOf.call(11));
  });

  it('creation: create multiple tokens to one user', async () => {
    await nft.createToken(accounts[0], { from: accounts[0] });
    await nft.createToken(accounts[0], { from: accounts[0] });

    const user1 = await nft.ownerOf.call(10);
    const user2 = await nft.ownerOf.call(11);
    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[0]);

    assert.strictEqual(totalSupply.toString(), '2');
    assert.strictEqual(balance.toString(), '2');
    assert.strictEqual(user1, accounts[0]);
    assert.strictEqual(user2, accounts[0]);
  });

  it('creation: create multiple tokens to multiple users', async () => {
    await nft.createToken(accounts[0], { from: accounts[0] });
    await nft.createToken(accounts[0], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    const totalSupply = await nft.totalSupply.call();
    const user1 = await nft.ownerOf.call(10);
    const user2 = await nft.ownerOf.call(11);
    const user3 = await nft.ownerOf.call(12);
    const user4 = await nft.ownerOf.call(13);
    const balance1 = await nft.balanceOf.call(accounts[0]);
    const balance2 = await nft.balanceOf.call(accounts[1]);

    assert.strictEqual(totalSupply.toString(), '4');
    assert.strictEqual(balance1.toString(), '2');
    assert.strictEqual(balance2.toString(), '2');
    assert.strictEqual(user1, accounts[0]);
    assert.strictEqual(user2, accounts[0]);
    assert.strictEqual(user3, accounts[1]);
    assert.strictEqual(user4, accounts[1]);
  });

  it('burn: create one token the burn/remove it', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    const burn = await nft.burnToken(10, { from: accounts[1] });
    // verify Transfer event (to == 0 if burning token)
    assert.strictEqual(burn.logs[0].event, 'Transfer');
    assert.strictEqual(burn.logs[0].args._from, accounts[1]);
    assert.strictEqual(burn.logs[0].args._to, '0x0000000000000000000000000000000000000000');
    assert.strictEqual(burn.logs[0].args._tokenId.toString(), '10');

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);

    assert.strictEqual(totalSupply.toString(), '0');
    assert.strictEqual(balance.toString(), '0');
    await assertRevert(nft.ownerOf.call(10));
  });

  it('burn: create one token and burn/remove a different ID (should fail)', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.burnToken(11, { from: accounts[1] }));
  });

  it('burn: create one token and burn/remove from a different owner (should fail)', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.burnToken(10, { from: accounts[2] }));
  });

  it('creation: create 2 tokens to one user and then burn/remove one (second token).', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.burnToken(11, { from: accounts[1] });

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);
    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(totalSupply.toString(), '1');
    assert.strictEqual(balance.toString(), '1');
    assert.strictEqual(owner, accounts[1]);
    await assertRevert(nft.ownerOf.call(11));
  });

  it('creation: create 2 token to one user then burn one and then create new one to same user.', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.burnToken(11, { from: accounts[1] });

    await nft.createToken(accounts[1], { from: accounts[0] });

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);
    const owner = await nft.ownerOf.call(10);
    const owner2 = await nft.ownerOf.call(12);

    assert.strictEqual(totalSupply.toString(), '2');
    assert.strictEqual(balance.toString(), '2');
    assert.strictEqual(owner, accounts[1]);
    assert.strictEqual(owner2, accounts[1]);
    await assertRevert(nft.ownerOf.call(11));
  });

  it('creation: create 3 tokens to one user and then remove middle token.', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.burnToken(11, { from: accounts[1] });

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);
    const owner = await nft.ownerOf.call(10); // accounts 1
    const owner2 = await nft.ownerOf.call(12); // accounts 1

    assert.strictEqual(totalSupply.toString(), '2');
    assert.strictEqual(balance.toString(), '2');
    assert.strictEqual(owner, accounts[1]);
    assert.strictEqual(owner2, accounts[1]);
    await assertRevert(nft.ownerOf.call(11));
  });

  it('creation: create 3 tokens to one user and then remove first token.', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.burnToken(10, { from: accounts[1] });

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);
    const owner = await nft.ownerOf.call(11);
    const owner2 = await nft.ownerOf.call(12);

    assert.strictEqual(totalSupply.toString(), '2');
    assert.strictEqual(balance.toString(), '2');
    assert.strictEqual(owner, accounts[1]);
    assert.strictEqual(owner2, accounts[1]);
    await assertRevert(nft.ownerOf.call(10));
  });

  it('creation: create 3 tokens to one user and then remove last token.', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.burnToken(12, { from: accounts[1] });

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);
    const owner = await nft.ownerOf.call(10);
    const owner2 = await nft.ownerOf.call(11);

    assert.strictEqual(totalSupply.toString(), '2');
    assert.strictEqual(balance.toString(), '2');
    assert.strictEqual(owner, accounts[1]);
    assert.strictEqual(owner2, accounts[1]);
    await assertRevert(nft.ownerOf.call(12));
  });

  // create 5 tokens to one user and then burn/remove all, then create 5 more.
  it('creation: create 5 tokens to one user, check state and then burn/remove all, then create 5 more, the burn from the other end.', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.burnToken(10, { from: accounts[1] });
    await nft.burnToken(11, { from: accounts[1] });
    await nft.burnToken(12, { from: accounts[1] });
    await nft.burnToken(13, { from: accounts[1] });
    await nft.burnToken(14, { from: accounts[1] });

    let totalSupply = await nft.totalSupply.call();
    let balance = await nft.balanceOf.call(accounts[1]);

    assert.strictEqual(totalSupply.toString(), '0');
    assert.strictEqual(balance.toString(), '0');
    await assertRevert(nft.ownerOf.call(10));
    await assertRevert(nft.ownerOf.call(11));
    await assertRevert(nft.ownerOf.call(12));
    await assertRevert(nft.ownerOf.call(13));
    await assertRevert(nft.ownerOf.call(14));

    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    totalSupply = await nft.totalSupply.call();
    balance = await nft.balanceOf.call(accounts[1]);

    assert.strictEqual(totalSupply.toString(), '5');
    assert.strictEqual(balance.toString(), '5');
    assert.equal(await nft.ownerOf.call(15), accounts[1]);
    assert.equal(await nft.ownerOf.call(16), accounts[1]);
    assert.equal(await nft.ownerOf.call(17), accounts[1]);
    assert.equal(await nft.ownerOf.call(18), accounts[1]);
    assert.equal(await nft.ownerOf.call(19), accounts[1]);

    await nft.burnToken(19, { from: accounts[1] });
    await nft.burnToken(18, { from: accounts[1] });
    await nft.burnToken(17, { from: accounts[1] });
    await nft.burnToken(16, { from: accounts[1] });
    await nft.burnToken(15, { from: accounts[1] });

    totalSupply = await nft.totalSupply.call();
    balance = await nft.balanceOf.call(accounts[1]);

    assert.strictEqual(totalSupply.toString(), '0');
    assert.strictEqual(balance.toString(), '0');
    await assertRevert(nft.ownerOf.call(15));
    await assertRevert(nft.ownerOf.call(16));
    await assertRevert(nft.ownerOf.call(17));
    await assertRevert(nft.ownerOf.call(18));
    await assertRevert(nft.ownerOf.call(19));
  });

  it('transfer: transfer token successfully', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    const result = await nft.transferFrom(accounts[1], accounts[2], 10, { from: accounts[1] });
    // verify Transfer event
    assert.strictEqual(result.logs[0].event, 'Transfer');
    assert.strictEqual(result.logs[0].args._from, accounts[1]);
    assert.strictEqual(result.logs[0].args._to, accounts[2]);
    assert.strictEqual(result.logs[0].args._tokenId.toString(), '10');

    const totalSupply = await nft.totalSupply.call();

    const balance1 = await nft.balanceOf.call(accounts[1]);

    const balance2 = await nft.balanceOf.call(accounts[2]);

    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(totalSupply.toString(), '1');
    assert.strictEqual(balance1.toString(), '0');
    assert.strictEqual(balance2.toString(), '1');

    assert.strictEqual(owner, accounts[2]);
  });

  it('transfer: transfer token to oneself (should be allowed)', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.transferFrom(accounts[1], accounts[1], 10, { from: accounts[1] });

    const totalSupply = await nft.totalSupply.call();
    const balance = await nft.balanceOf.call(accounts[1]);

    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(totalSupply.toString(), '1');
    assert.strictEqual(balance.toString(), '1');
    assert.strictEqual(owner, accounts[1]);
  });

  it('transfer: transfer token fail by token not exisitng', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.transferFrom(accounts[1], accounts[1], 11, { from: accounts[1] }));
  });

  it('transfer: transfer token fail by token sending to zero', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.transferFrom(accounts[1], 0, 10, { from: accounts[1] }));
  });

  it('transfer: transfer token fail by not being owner', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.transferFrom(accounts[3], accounts[2], 10, { from: accounts[3] }));
  });

  it('safe transfer: test receiver success', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    const receiver = await testReceiver.new({ gas: 6720000, from: accounts[0] });

    await nft.safeTransferFrom(accounts[1], receiver.address, 10, { from: accounts[1] });

    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(owner, receiver.address);
  });

  it('safe transfer: test receiver failure (non standard interface)', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    const receiver = await TestNonStandardReceiver.new({ gas: 6720000, from: accounts[0] });

    // eslint-disable-next-line max-len
    await assertRevert(nft.safeTransferFrom(accounts[1], receiver.address, 10, { from: accounts[1] }));
  });

  it('safe transfer: should succeed to transfer to non contract account', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.safeTransferFrom(accounts[1], accounts[2], 10, { from: accounts[1] });
    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(owner, accounts[2]);
  });

  it('approve: approve token successfully', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    const approve = await nft.approve(accounts[2], 10, { from: accounts[1] });

    // verify Approval event
    assert.strictEqual(approve.logs[0].event, 'Approval');
    assert.strictEqual(approve.logs[0].args._owner, accounts[1]);
    assert.strictEqual(approve.logs[0].args._approved, accounts[2]);
    assert.strictEqual(approve.logs[0].args._tokenId.toString(), '10');

    const allowed = await nft.getApproved.call(10);
    assert.strictEqual(allowed, accounts[2]);
  });

  it('approve: approve token the clear approval', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });

    const approve = await nft.approve(0, 10, { from: accounts[1] });

    // verify Approval event
    assert.strictEqual(approve.logs[0].event, 'Approval');
    assert.strictEqual(approve.logs[0].args._owner, accounts[1]);
    assert.strictEqual(approve.logs[0].args._approved, '0x0000000000000000000000000000000000000000');
    assert.strictEqual(approve.logs[0].args._tokenId.toString(), '10');

    const allowed = await nft.getApproved.call(10);
    assert.strictEqual(allowed, '0x0000000000000000000000000000000000000000');
  });

  it('approve: approve token failure by tokens not existing', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.approve(accounts[2], 11, { from: accounts[1] }));
    await assertRevert(nft.approve(accounts[2], 12, { from: accounts[1] }));
  });

  it('approve: approve token fail by not being owner', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.approve(accounts[2], 10, { from: accounts[3] }));
  });

  it('approve: approve token fail by approving same owner', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await assertRevert(nft.approve(accounts[1], 10, { from: accounts[1] }));
  });

  it('approve: create token to 1, approve token to 2, then successfully then transferFrom to other account 3', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });
    const transferFrom = await nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] }); // eslint-disable-line max-len

    // verify Approval events (clears approval)
    assert.strictEqual(transferFrom.logs[0].event, 'Approval');
    assert.strictEqual(transferFrom.logs[0].args._owner, accounts[1]);
    assert.strictEqual(transferFrom.logs[0].args._approved, '0x0000000000000000000000000000000000000000');
    assert.strictEqual(transferFrom.logs[0].args._tokenId.toString(), '10');

    // verify Transfer events
    assert.strictEqual(transferFrom.logs[1].event, 'Transfer');
    assert.strictEqual(transferFrom.logs[1].args._from, accounts[1]);
    assert.strictEqual(transferFrom.logs[1].args._to, accounts[3]);
    assert.strictEqual(transferFrom.logs[1].args._tokenId.toString(), '10');

    const totalSupply = await nft.totalSupply.call();
    const balance1 = await nft.balanceOf.call(accounts[1]);

    const balance2 = await nft.balanceOf.call(accounts[3]);

    const owner = await nft.ownerOf.call(10);
    const allowed = await nft.getApproved.call(10);

    assert.strictEqual(totalSupply.toString(), '1');

    assert.strictEqual(balance1.toString(), '0');
    assert.strictEqual(balance2.toString(), '1');

    assert.strictEqual(owner, accounts[3]);

    assert.strictEqual(allowed, '0x0000000000000000000000000000000000000000');
  });

  it('approve: create token to 1, approve token to 2, then successfully then transferFrom to approved account 2', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });
    await nft.transferFrom(accounts[1], accounts[2], 10, { from: accounts[2] });

    const totalSupply = await nft.totalSupply.call();
    const balance1 = await nft.balanceOf.call(accounts[1]);

    const balance2 = await nft.balanceOf.call(accounts[2]);

    const owner = await nft.ownerOf.call(10);
    const allowed = await nft.getApproved.call(10);

    assert.strictEqual(totalSupply.toString(), '1');

    assert.strictEqual(balance1.toString(), '0');
    assert.strictEqual(balance2.toString(), '1');

    assert.strictEqual(owner, accounts[2]);

    assert.strictEqual(allowed, '0x0000000000000000000000000000000000000000');
  });

  it('approve: create 2 tokens to 1, approve tokens to 2, then successfully then transferFrom 1 to account 3', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });
    await nft.approve(accounts[2], 11, { from: accounts[1] });
    await nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] });

    const totalSupply = await nft.totalSupply.call();
    const balance1 = await nft.balanceOf.call(accounts[1]);

    const balance2 = await nft.balanceOf.call(accounts[3]);

    const owner1 = await nft.ownerOf.call(10);
    const owner2 = await nft.ownerOf.call(11);
    const allowed1 = await nft.getApproved.call(10);
    const allowed2 = await nft.getApproved.call(11);

    assert.strictEqual(totalSupply.toString(), '2');

    assert.strictEqual(balance1.toString(), '1');
    assert.strictEqual(balance2.toString(), '1');

    assert.strictEqual(owner1, accounts[3]);
    assert.strictEqual(owner2, accounts[1]);

    assert.strictEqual(allowed1, '0x0000000000000000000000000000000000000000');
    assert.strictEqual(allowed2, accounts[2]);
  });

  it('approve: approve token successfully then fail transferFrom by token not existing', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });

    await assertRevert(nft.transferFrom(accounts[1], accounts[3], 11, { from: accounts[2] }));
  });

  it('approve: approve token successfully then fail transferFrom by different owner', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });

    await assertRevert(nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[3] }));
  });

  it('approve: approve token successfully then fail transferFrom by transferring to zero', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });
    await assertRevert(nft.transferFrom(accounts[1], 0, 10, { from: accounts[2] }));
  });

  it('uri: set URI and retrieve it', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.setTokenURI(10, 'newURI', { from: accounts[0] });

    const uri = await nft.tokenURI.call(10);
    assert.strictEqual(uri, 'newURI');
  });

  it('operators: set operator', async () => {
    const result = await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });

    assert.strictEqual(result.logs[0].event, 'ApprovalForAll');
    assert.strictEqual(result.logs[0].args._owner, accounts[1]);
    assert.strictEqual(result.logs[0].args._operator, accounts[2]);
    assert.strictEqual(result.logs[0].args._approved, true);

    // eslint-disable-next-line max-len
    const isApprovedForAll = await nft.isApprovedForAll(accounts[1], accounts[2], { from: accounts[4] });

    assert.strictEqual(isApprovedForAll, true);
  });

  it('operator: set operator & turn off operator', async () => {
    await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });
    const result = await nft.setApprovalForAll(accounts[2], false, { from: accounts[1] });

    assert.strictEqual(result.logs[0].event, 'ApprovalForAll');
    assert.strictEqual(result.logs[0].args._owner, accounts[1]);
    assert.strictEqual(result.logs[0].args._operator, accounts[2]);
    assert.strictEqual(result.logs[0].args._approved, false);

    // eslint-disable-next-line max-len
    const isApprovedForAll = await nft.isApprovedForAll(accounts[1], accounts[2], { from: accounts[4] });

    assert.strictEqual(isApprovedForAll, false);
  });

  it('operators: set operator & test transferFrom (with no approval)', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });

    await nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] });
    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(owner, accounts[3]);
  });

  it('operators: set operator & approve & test transferFrom', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });

    await nft.approve(accounts[2], 10, { from: accounts[1] });
    const result = await nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] });

    // verify the clearing of the approval even WITH an operator
    assert.strictEqual(result.logs[0].event, 'Approval');
    assert.strictEqual(result.logs[0].args._owner, accounts[1]);
    assert.strictEqual(result.logs[0].args._approved, '0x0000000000000000000000000000000000000000');
    assert.strictEqual(result.logs[0].args._tokenId.toString(), '10');

    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(owner, accounts[3]);
  });

  it('operators: set operator & test transferFrom & failure (transfer from someone else)', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });

    await assertRevert(nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[4] }));
  });

  it('operators: set operator & approve (other token) [1] & test transferFrom for first [0]', async () => {
    await nft.createToken(accounts[1], { from: accounts[0] });
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });

    await nft.approve(accounts[4], 11, { from: accounts[1] });
    await nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[2] });

    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(owner, accounts[3]);
  });

  it('operators: set operator & set approve THROUGH operator for other account & transferFrom ', async () => {
    // owner = 1
    // operator = 2
    // approved = 4
    // transferred = 3
    await nft.createToken(accounts[1], { from: accounts[0] });

    await nft.setApprovalForAll(accounts[2], true, { from: accounts[1] });

    await nft.approve(accounts[4], 10, { from: accounts[2] }); // operator approving
    await nft.transferFrom(accounts[1], accounts[3], 10, { from: accounts[4] });

    const owner = await nft.ownerOf.call(10);

    assert.strictEqual(owner, accounts[3]);
  });

  it('interface checks (ERC165): base, metadata & enumerable interfaces', async () => {
    // base ERC721 interface = 0x80ac58cd
    // metadata interface = 0x5b5e139f
    // enumerable interface = 0x780e9d63
    const baseInterface = await nft.supportsInterface.call(0x80ac58cd);
    const metadataInterface = await nft.supportsInterface.call(0x5b5e139f);
    const enumerableInterface = await nft.supportsInterface.call(0x780e9d63);

    // a sequence of 4 bytes that aren't implemented
    // to check if supportsInterface catches unimplemented interfaces
    const notImplementedInterface = await nft.supportsInterface.call(0x780e9d61);

    assert.strictEqual(baseInterface, true);
    assert.strictEqual(metadataInterface, true);
    assert.strictEqual(enumerableInterface, true);
    assert.strictEqual(notImplementedInterface, false);
  });

  it('naming: naming & symbol check', async () => {
    const name = await nft.name.call();
    const symbol = await nft.symbol.call();

    assert.strictEqual(name, 'Test Collectible');
    assert.strictEqual(symbol, 'TCL');
  });
});
