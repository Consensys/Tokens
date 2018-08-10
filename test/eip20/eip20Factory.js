const EIP20Factory = artifacts.require('EIP20Factory');
const EIP20Bytecode = artifacts.require('EIP20').bytecode;

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

    // verify: new token's address is listed in the `isEIP20` mapping
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

  it('should return true if given a contract address with the same bytecode', async () => {
    const factory = await EIP20Factory.new();

    // deploy contract using correct eip20 bytecode
    const txHash = await web3.eth.sendTransaction({
      from: accounts[0],
      gas: 4700000,
      gasPrice: 100000000000,
      data: EIP20Bytecode,
    });

    const { contractAddress } = await web3.eth.getTransactionReceipt(txHash);
    const result = await factory.verifyEIP20.call(contractAddress);
    assert.strictEqual(result, true, 'should have returned true because the bytecode was exact');
  });

  it('should return false when given a contract address with a modified bytecode', async () => {
    const factory = await EIP20Factory.new();

    // deploy contract using modified eip20 bytecode
    const modifiedBytecode = EIP20Bytecode.slice(0, -10).concat('1234567890');
    const txHash = await web3.eth.sendTransaction({
      from: accounts[0],
      gas: 4700000,
      gasPrice: 100000000000,
      data: modifiedBytecode,
    });

    const { contractAddress } = await web3.eth.getTransactionReceipt(txHash);
    const result = await factory.verifyEIP20.call(contractAddress);
    assert.strictEqual(result, false, 'should have returned false because the bytecode was not exact');
  });
});
