pragma solidity ^0.4.18;
import './ERC721.sol';


contract TestERC721Implementation is ERC721 {

    address public admin;

    function TestERC721Implementation() public {
        admin = msg.sender;
    }

    function createToken(address _minter) public {
        require(msg.sender == admin);
        totalSupply += 1;

        addToken(_minter, totalSupply);
    }
}
