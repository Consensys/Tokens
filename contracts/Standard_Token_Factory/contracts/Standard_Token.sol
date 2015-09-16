/*Most, basic default, standardised Token contract.
Allows the creation of a token with a finite issued amount to the creator.
This can't be changed.

Based on standardised APIs & slightly extended. https://github.com/ethereum/wiki/wiki/Standardized_Contract_APIs
adds AddressApproval & AddressApprovalOnce events
approve & approveOnce works on premise that approved always takes precedence.
adds unapprove to basic coin interface.*/

import "Coin";

contract Standard_Token is Coin {

    function Standard_Token(uint _initialAmount) {
        balances[msg.sender] = _initialAmount;
    }

    event CoinTransfer(address indexed from, address indexed to, uint256 value);
    event AddressApproval(address indexed from, address indexed to, bool result);
    event AddressApprovalOnce(address indexed from, address indexed to, uint256 value);

    function sendCoin(uint _value, address _to) returns (bool _success) {
        if (balances[msg.sender] >= _value) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            CoinTransfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    function sendCoinFrom(address _from, uint _value, address _to) returns (bool _success) {
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
                CoinTransfer(_from, _to, _value);
                return true;
            } else { return false; }
        } else { return false; }
    }

    function coinBalance() constant returns (uint _r) {
        return balances[msg.sender];
    }

    function coinBalanceOf(address _addr) constant returns (uint _r) {
        return balances[_addr];
    }

    function approve(address _addr) {
        approved[msg.sender][_addr] = true;
        AddressApproval(msg.sender, _addr, true);
    }

    function approveOnce(address _addr, uint256 _maxValue) {
        approved_once[msg.sender][_addr] = _maxValue;
        AddressApprovalOnce(msg.sender, _addr, _maxValue);
    }

    function unapprove(address _addr) {
        approved[msg.sender][_addr] = false;
        approved_once[msg.sender][_addr] = 0;
        AddressApproval(msg.sender, _addr, false);
        AddressApprovalOnce(msg.sender, _addr, 0);
    }

    function isApproved(address _proxy) constant returns (bool _r) {
        if(approved[msg.sender][_proxy] == true || approved_once[msg.sender][_proxy] > 0) {
            return true;
        }
    }

    function isApprovedFor(address _target, address _proxy) constant returns (bool _r) {
        if(approved[_target][_proxy] == true || approved_once[_target][_proxy] > 0) {
            return true;
        }
    }

    mapping (address => uint) public balances;
    mapping (address => mapping (address => bool)) public approved;
    mapping (address => mapping (address => uint256)) public approved_once;
}
