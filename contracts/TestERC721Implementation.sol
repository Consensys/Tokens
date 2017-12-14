pragma solidity ^0.4.18;
import './ERC721.sol';


contract TestERC721Implementation is ERC721 {

    address public admin;

    function TestERC721Implementation() public {
        admin = msg.sender;
    }

    function createToken(address _minter) public {
        require(msg.sender == admin);
        addToken(_minter, totalSupply);
        totalSupply += 1;
        //todo: Add Transfer event (from == 0)
    }

    function burnToken(address _from, uint256 _tokenId) public {
        require(msg.sender == admin);
        removeToken(_from, _tokenId);
        totalSupply -= 1;
        //todo: Add Transfer event (to == 0)
    }
}
