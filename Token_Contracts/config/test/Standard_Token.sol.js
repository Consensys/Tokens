"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var factory = function factory(Pudding) {
  // Inherit from Pudding. The dependency on Babel sucks, but it's
  // the easiest way to extend a Babel-based class. Note that the
  // resulting .js file does not have a dependency on Babel.

  var Standard_Token = (function (_Pudding) {
    _inherits(Standard_Token, _Pudding);

    function Standard_Token() {
      _classCallCheck(this, Standard_Token);

      _get(Object.getPrototypeOf(Standard_Token.prototype), "constructor", this).apply(this, arguments);
    }

    return Standard_Token;
  })(Pudding);

  ;

  // Set up specific data for this class.
  Standard_Token.abi = [{ "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "_total", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [{ "name": "_target", "type": "address" }, { "name": "_proxy", "type": "address" }], "name": "isApprovedOnceFor", "outputs": [{ "name": "_maxValue", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [{ "name": "_target", "type": "address" }, { "name": "_proxy", "type": "address" }], "name": "isApprovedFor", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [{ "name": "_address", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }, { "name": "_maxValue", "type": "uint256" }], "name": "approveOnce", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "_address", "type": "address" }], "name": "unapprove", "outputs": [{ "name": "success", "type": "bool" }], "type": "function" }, { "inputs": [{ "name": "_initial_amount", "type": "uint256" }], "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_proxy", "type": "address" }, { "indexed": false, "name": "_result", "type": "bool" }], "name": "AddressApproval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_address", "type": "address" }, { "indexed": true, "name": "_proxy", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "AddressApprovalOnce", "type": "event" }];
  Standard_Token.binary = "60606040526040516020806104fc833950608060405251600160a060020a03331660009081526020819052604090208190556003819055506104b7806100456000396000f3606060405236156100775760e060020a600035046318160ddd8114610079578063181670e6146100875780631fa03a2b146100bd57806323b872dd146100f457806370a0823114610150578063930b7a2314610175578063a9059cbb146101dd578063daea85c514610261578063fbf1f78a146102cc575b005b6003545b6060908152602090f35b61007d600435602435600160a060020a038083166000908152600260209081526040808320938516835292905220545b92915050565b61007d600435602435600160a060020a0380831660009081526001602090815260408083209385168352929052205460ff166100b7565b61007d600435602435604435600160a060020a03831660009081526020819052604081205481908390106104af57600160209081526040808320600160a060020a033316845290915281205460ff1615610381575060016103f8565b61007d600435600160a060020a0381166000908152602081905260409020545b919050565b61007d600435602435600160a060020a03338116600081815260026020908152604080832094871680845294825282208590556060858152919392917fcc92c05edef6bc5dcdfab43862409620fd81888eec1be99935f19375c4ef704e9190a35060016100b7565b61007d600435602435600160a060020a03331660009081526020819052604081205482901061037c57604080822080548490039055600160a060020a03808516808452918320805485019055606084815233909116907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602090a35060016100b7565b61007d600435600160a060020a0333811660008181526001602081815260408084209587168085529582528320805460ff1916831790556060918252919392917f0e40f4b0b06b7d270eb92aed48caf256e6bbe4f83c5492e7433958cf5566192091a3506001610170565b61007d600435600160a060020a033381166000818152600160209081526040808320948616808452948252808320805460ff1916905583835260028252808320858452825282208290556060828152919392917f0e40f4b0b06b7d270eb92aed48caf256e6bbe4f83c5492e7433958cf556619209190a3600160a060020a038083169033167fcc92c05edef6bc5dcdfab43862409620fd81888eec1be99935f19375c4ef704e60206060a3919050565b6100b7565b600160a060020a03808616825260026020908152604080842033909316845291905281205483116103f85760019050805060006002600050600087600160a060020a03168152602001908152602001600020600050600033600160a060020a03168152602001908152602001600020600050819055505b80600114156104af57826000600050600087600160a060020a03168152602001908152602001600020600082828250540392505081905550826000600050600086600160a060020a0316815260200190815260200160002060008282825054019250508190555083600160a060020a031685600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3600191505b50939250505056";

  if ("" != "") {
    Standard_Token.address = "";

    // Backward compatibility; Deprecated.
    Standard_Token.deployed_address = "";
  }

  Standard_Token.generated_with = "1.0.2";
  Standard_Token.contract_name = "Standard_Token";

  return Standard_Token;
};

// Nicety for Node.
factory.load = factory;

if (typeof module != "undefined") {
  module.exports = factory;
} else {
  // There will only be one version of Pudding in the browser,
  // and we can use that.
  window.Standard_Token = factory;
}