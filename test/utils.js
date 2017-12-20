module.exports = {
  expectThrow: async (promise) => {
    const errMsg = 'Expected throw not received';
    try {
      await promise;
    } catch (err) {
      assert(err.toString().includes('invalid opcode'), errMsg);
      return;
    }
    assert.fail(errMsg);
  },
};
