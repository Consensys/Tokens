/*
Implements EIP20 token that prevent transferring to the 0x0 address, and the contract address, according to Token Implementation Best Practices.
Reference: https://consensys.github.io/smart-contract-best-practices/tokens/


pragma solidity ^0.4.18;

import "./EIP20.sol";


contract SafeEIP20 is EIP20 {

    modifier validDestination(address _to) {
        require(_to != address(0x0)); // If the user did not enter a value for _to, it will equal to "zero"
        require(_to != address(this)); // address(this) is the Contract Address
        _;
    }
    
    function SafeEIP20(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    ) public EIP20(_initialAmount, _tokenName, _decimalUnits, _tokenSymbol) {
    }

    function transfer(address _to, uint256 _value) validDestination(_to) public returns (bool success) {
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) validDestination(_to) public returns (bool success) {
        return super.transferFrom(_from, _to, _value);
    }
}
