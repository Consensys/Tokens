var SolidityCoder = require('web3/lib/solidity/coder.js');

module.exports = function(web3,contractList) {
    if (!web3) {
        throw new Error('Missing web3 dependency');
    }

    var contracts = {};
    contractList.forEach(e => {
        contracts[e.contract_name] = e;
    });

    function toStrictSolidityType(solTypes){
        var result = [];
        for(var i=0;i<solTypes.length;++i){
            result.push(isContractTypeName(solTypes[i]) ? 'address' : solTypes[i]);
        }
        return result;
    }

    function isContractTypeName(name){
        var c0 = name.charAt(0);
        return c0 == c0.toUpperCase(c0);
    }

    return {
        createSingleEventPromise : function createSingleEventPromise(eventFilter){
            return new Promise(function(resolve,reject){
                eventFilter.watch(function (error, event) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(event.args);
                    }
                    eventFilter.stopWatching();
                });
            });
        },
        resolveEvent : function (eventSignature) {
            return function (tx_id) {
                var p = eventSignature.indexOf('(');
                var eventName = eventSignature.substr(0,p);
                var eventParamTypes = eventSignature.substring(p + 1).replace(')', '').split(',');
                var strictParamTypes = toStrictSolidityType(eventParamTypes);
                var strictEventSignatur = eventName + '('+strictParamTypes.join(',')+')';
                var hash = web3.sha3(strictEventSignatur);
                //ToDo: some web3 implementations return hash without leading '0x' ?!
                if (!hash.startsWith('0x')) {
                    hash = '0x' + hash;
                }
                var receipt = web3.eth.getTransactionReceipt(tx_id);
                var logs = receipt.logs;
                // filter all the other events that are not the hash our our method signature
                logs = logs.filter(function (log) {
                    return (hash == log.topics[0]);
                });
                if (logs.length !== 1) {
                    //ToDo: throwing error in promises do not stop the test !!!
                    throw new Error('Should have only 1 log event');
                }
                var decodedParams = SolidityCoder.decodeParams(
                    toStrictSolidityType(eventParamTypes),
                    logs[0].data.replace('0x', '')
                );
                if(decodedParams.length != eventParamTypes.length){
                    throw new Error("not all event parameters were decoded?");
                }
                for(var i=0;i<eventParamTypes.length;++i){
                   if(isContractTypeName(eventParamTypes[i]))
                       decodedParams[i] = contracts[eventParamTypes[i]].at(decodedParams[i]);
                }
                return decodedParams.length == 1 ? decodedParams[0] : decodedParams;
            };
        }
    }
}