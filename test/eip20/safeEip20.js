const { assertRevert } = require('../helpers/assertRevert');

const SafeEIP20Abstraction = artifacts.require('SafeEIP20');
let HST;

contract('SafeEIP20', (accounts) => {
  beforeEach(async () => {
    HST = await SafeEIP20Abstraction.new(10000, 'Simon Bucks', 1, 'SBX', { from: accounts[0] });
  });
  
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it('transfers: should fail when the recipient is the zero address', async () => {
    await assertRevert(HST.transfer.call(ZERO_ADDRESS, 100, { from: accounts[0] }));
  });
  
  it('transfers-from: should fail when the recipient is the zero address.', async () => {
    await HST.approve(accounts[1], 100, { from: accounts[0] });
    const allowance = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance.toNumber(), 100);

    await assertRevert(HST.transferFrom.call(accounts[0], ZERO_ADDRESS, 10, { from: accounts[1] }));
  });   
  
  it('transfers: should fail when the recipient is the contract address', async () => {
    await assertRevert(HST.transfer.call(HST.address, 100, { from: accounts[0] }));
  });
  
  it('transfers-from: should fail when the recipient is the contract address.', async () => {
    await HST.approve(accounts[1], 100, { from: accounts[0] });
    const allowance = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance.toNumber(), 100);

    await assertRevert(HST.transferFrom.call(accounts[0], HST.address, 10, { from: accounts[1] }));
  });   
});
