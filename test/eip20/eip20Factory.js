const EIP20Factory = artifacts.require('EIP20Factory');

contract('EIP20Factory', (accounts) => {
  it('Verify an EIP20 token once deployed using both verification functions.', async () => {
    const initialAmount = 100000;
    const name = 'Simon Bucks';
    const decimals = 2;
    const symbol = 'SBX';
    const args = [initialAmount, name, decimals, symbol, { from: accounts[0] }];

    // new instance
    const factory = await EIP20Factory.new();

    // simulate: factory create a new EIP20 token
    const newTokenAddr = await factory.createEIP20.call(...args);

    // tx: factory create a new EIP20 token
    await factory.createEIP20(...args);

    // verify: new token's bytecode === EIP20's bytecode
    const result = await factory.verifyEIP20.call(newTokenAddr, { from: accounts[0] });
    assert.strictEqual(result, true, 'the bytecode at newTokenAddr '
      + 'was not the same as the bytecode of an EIP20 token');

    const isEIP20 = await factory.isEIP20.call(newTokenAddr);
    assert.strictEqual(isEIP20, true, 'is not eip20');
  });

  it('should verify that the `created` mapping includes a newly created token', async () => {
    const initialAmount = 1000000;
    const name = 'Maurelian Moolah';
    const decimals = 3;
    const symbol = 'MOO';
    const args = [initialAmount, name, decimals, symbol, { from: accounts[0] }];

    // new instance
    const factory = await EIP20Factory.new();

    // simulate: factory create a new EIP20 token
    const newTokenAddr = await factory.createEIP20.call(...args);

    // tx: factory create a new EIP20 token
    await factory.createEIP20(...args);

    // verify: created mapping at index 1 is the newly deployed token
    const result = await factory.created.call(accounts[0], 1);
    assert.strictEqual(
      result,
      newTokenAddr,
      'the `created` mapping does not include the expected token',
    );
  });
});
