pragma solidity ^0.4.18;
import './ERC721.sol';

/*
The API names here should not be regarded as conforming to a specific API.
Perhaps EIP 612 should be used here: https://github.com/ethereum/EIPs/pull/621
This is just to test creation/burning of an ERC721 token.
*/
contract TestERC721Implementation is ERC721 {

    address public admin;
    uint256 public counter = 0;

    function TestERC721Implementation() public {
        admin = msg.sender;
    }

    function createToken(address _minter) public {
        require(msg.sender == admin);
        addToken(_minter, counter);
        Transfer(0, _minter, counter);
        totalSupply += 1;
        counter += 1; // every new token gets a new ID
    }

    function burnToken(uint256 _tokenId) public {
        require(tokenOwner[_tokenId] == msg.sender); //token should be in control of owner
        removeToken(msg.sender, _tokenId);
        Transfer(msg.sender, 0, _tokenId);
        totalSupply -= 1;
    }
}
