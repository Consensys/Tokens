pragma solidity ^0.4.24;
import "./EIP721.sol";


/*
A Test Implementation that allows and admin to mint/burn NFTs.
---
The API names here should not be regarded as conforming to a specific API.
Perhaps EIP 612 should be used here: https://github.com/ethereum/EIPs/pull/621
*/
contract TestEIP721Implementation is EIP721 {
    address public admin;
    uint256 public counter = 10;

    constructor() public {
        admin = msg.sender;
        name = "Test Collectible";
        symbol = "TCL";
    }

    function createToken(address _minter) public {
        require(msg.sender == admin);
        addToken(_minter, counter);
        emit Transfer(0, _minter, counter);
        counter += 1; // every new token gets a new ID
    }

    function burnToken(uint256 _tokenId) public {
        require(ownerOfToken[_tokenId] == msg.sender); //token should be in control of owner
        removeToken(msg.sender, _tokenId);
        emit Transfer(msg.sender, 0, _tokenId);
    }

    function setTokenURI(uint256 _tokenID, string URI) public {
        require(msg.sender == admin);
        tokenURIs[_tokenID] = URI;
    }
}
