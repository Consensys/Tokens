var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("HumanStandardTokenFactory error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("HumanStandardTokenFactory error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("HumanStandardTokenFactory contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of HumanStandardTokenFactory: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to HumanStandardTokenFactory.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: HumanStandardTokenFactory not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_initialAmount",
            "type": "uint256"
          },
          {
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_decimals",
            "type": "uint8"
          },
          {
            "name": "_symbol",
            "type": "string"
          }
        ],
        "name": "createHumanStandardToken",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          },
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "created",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "humanStandardByteCode",
        "outputs": [
          {
            "name": "",
            "type": "bytes"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "isHumanToken",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_tokenContract",
            "type": "address"
          }
        ],
        "name": "verifyHumanStandardToken",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "inputs": [],
        "type": "constructor"
      }
    ],
    "unlinked_binary": "0x600c60609081527f56657269667920546f6b656e000000000000000000000000000000000000000060805260e06040819052600360a08181527f565458000000000000000000000000000000000000000000000000000000000060c0526000936101ac9361271093919290869081908690869086908690610997806112ba833990810185815261012082018490526080610100830181815286516101608501528651929390926101408201926101809092019190808381848e6004600f6020601f8601048f0201f150905090810190601f1680156100f15780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f16801561014a5780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f0801561000257600160a060020a03331660009081526020819052604090208054600181018083559293509091828183801582901161029057600083815260209020610290918101908301610237565b90506101e58160408051602081810183526000918290528251843b603f8101601f19168201909452838152929182918401853c50919050565b60026000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061024b57805160ff19168380011785555b5061027b9291505b8082111561028c5760008155600101610237565b8280016001018555821561022f579182015b8281111561022f57825182600050559160200191906001019061025d565b505050610f708061034a6000396000f35b5090565b50505060009283525060208083209091018054600160a060020a03191684179055600160a060020a0383811680845260018084526040808620805460ff19169092179091558051840185905280517fa9059cbb000000000000000000000000000000000000000000000000000000008152339093166004840152602483018b905251909363a9059cbb93604480850194919392918390030190829087803b156100025760325a03f11561000257509197965050505050505056606060405260e060020a600035046308216c0f811461004a5780635f8dead31461022e578063acad94ae1461026f578063ddea6df3146102cf578063fc94dd18146102ef575b610002565b346100025760408051602060248035600481810135601f8101859004850286018501909652858552610343958135959194604494929390920191819084018382808284375050604080516020606435808b0135601f810183900483028401830190945283835297999835989760849750919550602491909101935090915081908401838280828437509496505050505050506000600085858585604051610997806105d983390180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156101615780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156101ba5780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f080156100025733600160a060020a03166000908152602081905260409020805460018101808355929350909182818380158290116103e1578183600052602060002091820191016103e191905b808211156104a8576000815560010161021a565b346100025761034360043560243560006020819052828152604090208054829081101561000257506000908152602090200154600160a060020a0316905081565b34610002576040805160028054602060018216156101000260001901909116829004601f810182900482028401820190945283835261035f93908301828280156104d75780601f106104ac576101008083540402835291602001916104d7565b34610002576103cd60043560016020526000908152604090205460ff1681565b34610002576103cd6004356040805160208101909152600080825290816104eb8460408051602081810183526000918290528251843b603f8101601f19168201909452838152929182918401853c50919050565b60408051600160a060020a039092168252519081900360200190f35b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103bf5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b604080519115158252519081900360200190f35b5050506000928352506020808320909101805473ffffffffffffffffffffffffffffffffffffffff191684179055600160a060020a0380841680845260018084526040808620805460ff19169092179091558051840185905280517fa9059cbb000000000000000000000000000000000000000000000000000000008152339093166004840152602483018b905251909363a9059cbb93604480850194919392918390030190829087803b156100025760325a03f115610002575091979650505050505050565b5090565b820191906000526020600020905b8154815290600101906020018083116104ba57829003601f168201915b505050505081565b600192505b5050919050565b6002805482519294506000196101006001831615020116041461051157600092506104e4565b5060005b81518110156104df5760028054829060001961010060018316150201168290048110156100025781546001161561055b5790600052602060002090602091828204019190065b9054901a60f860020a027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168282815181101561000257016020015160f860020a90819004027fff0000000000000000000000000000000000000000000000000000000000000016146105d157600092506104e4565b6001016105155660a060405260046060527f48302e31000000000000000000000000000000000000000000000000000000006080526006805460008290527f48302e310000000000000000000000000000000000000000000000000000000882556100b5907ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f602060026001841615610100026000190190931692909204601f01919091048101905b8082111561018357600081556001016100a1565b505060405161099738038061099783398101604052808051906020019091908051820191906020018051906020019091908051820191906020015050600160a060020a03331660009081526001602081815260408320879055868355855160038054948190529360029381161561010002600019011692909204601f9081018290047fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b908101939290919088019083901061018757805160ff19168380011785555b506101b79291506100a1565b5090565b82800160010185558215610177579182015b82811115610177578251826000505591602001919060010190610199565b50506004805460ff191683179055805160058054600082905290917f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0602060026001851615610100026000190190941693909304601f90810184900482019386019083901061023957805160ff19168380011785555b506102699291506100a1565b8280016001018555821561022d579182015b8281111561022d57825182600050559160200191906001019061024b565b50505050505061071a8061027d6000396000f36060604052361561008d5760e060020a600035046306fdde03811461009a578063095ea7b3146100fd57806318160ddd1461017757806323b872dd14610185578063313ce5671461027757806354fd4d501461028857806370a08231146102eb57806395d89b411461031e578063a9059cbb14610381578063cae9ca511461042d578063dd62ed3e146105f9575b3461000257610632610002565b34610002576040805160038054602060026001831615610100026000190190921691909104601f810182900482028401820190945283835261063493908301828280156106f75780601f106106cc576101008083540402835291602001916106f7565b34610002576106a260043560243533600160a060020a03908116600081815260026020908152604080832094871680845294825280832086905580518681529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a35060015b92915050565b346100025761030c60005481565b34610002576106a2600435602435604435600160a060020a0383166000908152600160205260408120548290108015906101dd575060026020908152604080832033600160a060020a03168452909152812054829010155b80156101e95750600082115b156106ff57600160a060020a03838116600081815260016020908152604080832080548801905588851680845281842080548990039055600283528184203390961684529482529182902080548790039055815186815291519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a3506001610703565b34610002576106b660045460ff1681565b34610002576040805160068054602060026001831615610100026000190190921691909104601f810182900482028401820190945283835261063493908301828280156106f75780601f106106cc576101008083540402835291602001916106f7565b3461000257600160a060020a03600435166000908152600160205260409020545b60408051918252519081900360200190f35b34610002576106346005805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156106f75780601f106106cc576101008083540402835291602001916106f7565b34610002576106a260043560243533600160a060020a03166000908152600160205260408120548290108015906103b85750600082115b1561070a5733600160a060020a03908116600081815260016020908152604080832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a3506001610171565b3461000257604080516020604435600481810135601f81018490048402850184019095528484526106a294813594602480359593946064949293910191819084018382808284375094965050505050505033600160a060020a03908116600081815260026020908152604080832094881680845294825280832087905580518781529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a383600160a060020a031660405180807f72656365697665417070726f76616c28616464726573732c75696e743235362c81526020017f616464726573732c627974657329000000000000000000000000000000000000815260200150602e019050604051809103902060e060020a9004338530866040518560e060020a0281526004018085600160a060020a0316815260200184815260200183600160a060020a031681526020018280519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156105d15780820380516001836020036101000a031916815260200191505b509450505050506000604051808303816000876161da5a03f192505050151561071257610002565b346100025761030c600435602435600160a060020a03828116600090815260026020908152604080832093851683529290522054610171565b005b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156106945780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b604080519115158252519081900360200190f35b6040805160ff9092168252519081900360200190f35b820191906000526020600020905b8154815290600101906020018083116106da57829003601f168201915b505050505081565b5060005b9392505050565b506000610171565b5060016107035660a060405260046060527f48302e31000000000000000000000000000000000000000000000000000000006080526006805460008290527f48302e310000000000000000000000000000000000000000000000000000000882556100b5907ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f602060026001841615610100026000190190931692909204601f01919091048101905b8082111561018357600081556001016100a1565b505060405161099738038061099783398101604052808051906020019091908051820191906020018051906020019091908051820191906020015050600160a060020a03331660009081526001602081815260408320879055868355855160038054948190529360029381161561010002600019011692909204601f9081018290047fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b908101939290919088019083901061018757805160ff19168380011785555b506101b79291506100a1565b5090565b82800160010185558215610177579182015b82811115610177578251826000505591602001919060010190610199565b50506004805460ff191683179055805160058054600082905290917f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0602060026001851615610100026000190190941693909304601f90810184900482019386019083901061023957805160ff19168380011785555b506102699291506100a1565b8280016001018555821561022d579182015b8281111561022d57825182600050559160200191906001019061024b565b50505050505061071a8061027d6000396000f36060604052361561008d5760e060020a600035046306fdde03811461009a578063095ea7b3146100fd57806318160ddd1461017757806323b872dd14610185578063313ce5671461027757806354fd4d501461028857806370a08231146102eb57806395d89b411461031e578063a9059cbb14610381578063cae9ca511461042d578063dd62ed3e146105f9575b3461000257610632610002565b34610002576040805160038054602060026001831615610100026000190190921691909104601f810182900482028401820190945283835261063493908301828280156106f75780601f106106cc576101008083540402835291602001916106f7565b34610002576106a260043560243533600160a060020a03908116600081815260026020908152604080832094871680845294825280832086905580518681529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a35060015b92915050565b346100025761030c60005481565b34610002576106a2600435602435604435600160a060020a0383166000908152600160205260408120548290108015906101dd575060026020908152604080832033600160a060020a03168452909152812054829010155b80156101e95750600082115b156106ff57600160a060020a03838116600081815260016020908152604080832080548801905588851680845281842080548990039055600283528184203390961684529482529182902080548790039055815186815291519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a3506001610703565b34610002576106b660045460ff1681565b34610002576040805160068054602060026001831615610100026000190190921691909104601f810182900482028401820190945283835261063493908301828280156106f75780601f106106cc576101008083540402835291602001916106f7565b3461000257600160a060020a03600435166000908152600160205260409020545b60408051918252519081900360200190f35b34610002576106346005805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156106f75780601f106106cc576101008083540402835291602001916106f7565b34610002576106a260043560243533600160a060020a03166000908152600160205260408120548290108015906103b85750600082115b1561070a5733600160a060020a03908116600081815260016020908152604080832080548890039055938716808352918490208054870190558351868152935191937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929081900390910190a3506001610171565b3461000257604080516020604435600481810135601f81018490048402850184019095528484526106a294813594602480359593946064949293910191819084018382808284375094965050505050505033600160a060020a03908116600081815260026020908152604080832094881680845294825280832087905580518781529051929493927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a383600160a060020a031660405180807f72656365697665417070726f76616c28616464726573732c75696e743235362c81526020017f616464726573732c627974657329000000000000000000000000000000000000815260200150602e019050604051809103902060e060020a9004338530866040518560e060020a0281526004018085600160a060020a0316815260200184815260200183600160a060020a031681526020018280519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156105d15780820380516001836020036101000a031916815260200191505b509450505050506000604051808303816000876161da5a03f192505050151561071257610002565b346100025761030c600435602435600160a060020a03828116600090815260026020908152604080832093851683529290522054610171565b005b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156106945780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b604080519115158252519081900360200190f35b6040805160ff9092168252519081900360200190f35b820191906000526020600020905b8154815290600101906020018083116106da57829003601f168201915b505050505081565b5060005b9392505050565b506000610171565b50600161070356",
    "events": {},
    "updated_at": 1476998168607,
    "links": {}
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "HumanStandardTokenFactory";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.HumanStandardTokenFactory = Contract;
  }
})();
