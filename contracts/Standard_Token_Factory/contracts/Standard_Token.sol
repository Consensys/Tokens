/*Most, basic default, standardised Token contract.
Allows the creation of a token with a finite issued amount to the creator.

Based on standardised APIs: https://github.com/ethereum/wiki/wiki/Standardized_Contract_APIs
.*/

import "Token";

contract Standard_Token is Token {

    function Standard_Token(uint256 _initial_amount) {
        balances[msg.sender] = _initial_amount;
        total_supply = _initial_amount;
    }

    function transfer(address _to, uint256 _value) returns (bool success) {
        if (balances[msg.sender] >= _value) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (balances[_from] >= _value) {
            bool transfer = false;
            if(approved[_from][msg.sender]) {
                transfer = true;
            } else {
                if(_value <= approved_once[_from][msg.sender]) {
                    transfer = true;
                    approved_once[_from][msg.sender] = 0; //reset
                }
            }

            if(transfer == true) {
                balances[_from] -= _value;
                balances[_to] += _value;
                Transfer(_from, _to, _value);
                return true;
            } else { return false; }
        } else { return false; }
    }

    function balanceOf(address _address) constant returns (uint256 balance) {
        return balances[_address];
    }

    function approve(address _address) returns (bool success) {
        approved[msg.sender][_address] = true;
        AddressApproval(msg.sender, _address, true);
        return true;
    }

    function unapprove(address _address) returns (bool success) {
        approved[msg.sender][_address] = false;
        approved_once[msg.sender][_address] = 0;
        AddressApproval(msg.sender, _address, false);
        AddressApprovalOnce(msg.sender, _address, 0);
    }

    function isApprovedFor(address _target, address _proxy) constant returns (bool success) {
        return approved[_target][_proxy];
    }

    function approveOnce(address _address, uint256 _maxValue) returns (bool success) {
        approved_once[msg.sender][_address] = _maxValue;
        AddressApprovalOnce(msg.sender, _address, _maxValue);
        return true;
    }

    function isApprovedOnceFor(address _target, address _proxy) constant returns (uint256 _maxValue) {
        return approved_once[_target][_proxy];
    }

    function totalSupply() constant returns (uint256 _total) {
        return total_supply;
    }

    mapping (address => uint) balances;
    mapping (address => mapping (address => bool)) approved;
    mapping (address => mapping (address => uint256)) approved_once;
    uint256 total_supply;
}
