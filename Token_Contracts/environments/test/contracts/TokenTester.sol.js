// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":true,"inputs":[],"name":"tokenContractAddress","outputs":[{"name":"","type":"address"}],"type":"function"}],
    binary: "606060405260428060106000396000f3606060405260e060020a600035046382edaf948114601a575b005b603860005473ffffffffffffffffffffffffffffffffffffffff1681565b6060908152602090f3",
    unlinked_binary: "606060405260428060106000396000f3606060405260e060020a600035046382edaf948114601a575b005b603860005473ffffffffffffffffffffffffffffffffffffffff1681565b6060908152602090f3",
    address: "0xbc5862ed04de6e04a21d87e4cd81744a889112ff",
    generated_with: "2.0.9",
    contract_name: "TokenTester"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("TokenTester error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("TokenTester error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("TokenTester error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("TokenTester error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.TokenTester = Contract;
  }

})();
