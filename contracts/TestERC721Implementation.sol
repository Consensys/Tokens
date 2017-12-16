pragma solidity ^0.4.18;
import './ERC721.sol';


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

    function burnToken(address _from, uint256 _tokenId) public {
        require(msg.sender == admin);
        removeToken(_from, _tokenId);
        Transfer(_from, 0, _tokenId);
        totalSupply -= 1;
    }
}
