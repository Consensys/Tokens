pragma solidity ^0.4.8;

contract ApprovalRecipient {
    function receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        returns (bool success);
}