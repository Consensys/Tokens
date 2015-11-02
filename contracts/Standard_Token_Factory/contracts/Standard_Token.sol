/*Most, basic default, standardised Token contract.
Allows the creation of a token with a finite issued amount to the creator.

Based on standardised APIs: https://github.com/ethereum/wiki/wiki/Standardized_Contract_APIs
.*/

import "Token";

contract Standard_Token is Token {
    uint total;
    bytes32 defaultIdentifier = bytes32(address(this));

    function Standard_Token(uint _initialAmount) {
        balances[msg.sender][bytes32(address(this))] = _initialAmount;
        totals[defaultIdentifier] = _initialAmount;
    }

    function transfer(uint _value, bytes32 _identifier, address _to) returns (bool _success) {
        if (balances[msg.sender][_identifier] >= _value) {
            balances[msg.sender][_identifier] -= _value;
            balances[_to][_identifier] += _value;
            Transfer(msg.sender, _identifier, _to, _value);
            return true;
        } else { return false; }
    }

    function transferFrom(address _from, bytes32 _identifier, uint _value, address _to) returns (bool _success) {
        if (balances[_from][_identifier] >= _value) {
            bool transfer = false;
            if(approved[_from][_identifier][msg.sender]) {
                transfer = true;
            } else {
                if(_value <= approved_once[_from][_identifier][msg.sender]) {
                    transfer = true;
                    approved_once[_from][_identifier][msg.sender] = 0; //reset
                }
            }

            if(transfer == true) {
                balances[_from][_identifier] -= _value;
                balances[_to][_identifier] += _value;
                Transfer(_from, _identifier, _to, _value);
                return true;
            } else { return false; }
        } else { return false; }
    }

    function balanceOf(address _addr, bytes32 _identifier) constant returns (uint _r) {
        return balances[_addr][_identifier];
    }

    function approve(address _addr, bytes32 _identifier) returns (bool _success) {
        approved[msg.sender][_identifier][_addr] = true;
        AddressApproval(msg.sender, _identifier, _addr, true);
        return true;
    }
    
    function unapprove(address _addr, bytes32 _identifier) returns (bool _success) {
        approved[msg.sender][_identifier][_addr] = false;
        approved_once[msg.sender][_identifier][_addr] = 0;
        //debatable whether to include...
        AddressApproval(msg.sender, _identifier, _addr, false);
        AddressApprovalOnce(msg.sender, _identifier, _addr, 0);
    }
    
    function isApprovedFor(address _target, bytes32 _identifier, address _proxy) constant returns (bool _r) {
        return approved[_target][_identifier][_proxy];
    }

    function approveOnce(address _addr, bytes32 _identifier, uint256 _maxValue) returns (bool _success) {
        approved_once[msg.sender][_identifier][_addr] = _maxValue;
        AddressApprovalOnce(msg.sender, _identifier, _addr, _maxValue);
        return true;
    }

    function isApprovedOnceFor(address _target, bytes32 _identifier, address _proxy) constant returns (uint _maxValue) {
        return approved_once[_target][_identifier][_proxy];
    }

    function totalAmount(bytes32 _identifier) constant returns (uint _totalAmount) {
        return totals[_identifier]; 
    }

    //explicitly not publicly accessible. Should rely on methods for purpose of standardization.
    mapping (bytes32 => uint) totals;
    mapping (address => mapping (bytes32 => uint)) balances;
    mapping (address => mapping (bytes32 => mapping (address => bool))) approved;
    mapping (address => mapping (bytes32 => mapping (address => uint256))) approved_once;
}
