pragma solidity ^0.4.18;
import './ERC721Interface.sol';


/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
// https://github.com/ethereum/EIPs/issues/721
// Derived from https://github.com/decentraland/land/blob/master/contracts/BasicNFT.sol
// & https://github.com/axiomzen/cryptokitties-bounty/blob/master/contracts/KittyOwnership.sol
// & https://github.com/axiomzen/cryptokitties-bounty/blob/master/contracts/KittyBase.sol
contract ERC721 is ERC721Interface {

    uint256 public totalSupply;
    string public name;
    string public symbol;

    // Array of owned tokens for a user
    mapping(address => uint256[]) public ownedTokens;
    mapping(address => uint256) public balances;
    mapping(uint256 => uint256) public tokenIndexInOwnerArray;

    // Mapping from token ID to owner
    mapping(uint256 => address) public tokenOwner;

    // Allowed transfers for a token (only one at a time)
    mapping(uint256 => address) public allowed;

    // Metadata associated with each token
    mapping(uint256 => string) public tokenMetadata;


    modifier tokenExists(uint256 _tokenId) {
        require(tokenOwner[_tokenId] != 0);
        _;
    }

    //how many badges of a specific release someone owns
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    //who owns a specific badge
    function ownerOf(uint256 _tokenId) public view tokenExists(_tokenId) returns (address) {
        return tokenOwner[_tokenId];
    }

    //approve a contract to transfer badge on your behalf
    //todo: returns success ala ERC20?
    function approve(address _to, uint256 _tokenId) tokenExists(_tokenId) public {
        internalApprove(msg.sender, _to, _tokenId);
    }

    //an approved contract transfers the badge for you (after approval)
    //todo: returns success ala ERC20?
    function transferFrom(address _from, address _to, uint256 _tokenId) tokenExists(_tokenId) public {
        require(allowed[_tokenId] == msg.sender); //allowed to transfer
        require(tokenOwner[_tokenId] == _from); //token should still be in control owner
        require(_to != 0); //not allowed to burn in transfer method

        internalTransfer(_from, _to, _tokenId);
    }

    //transfer badge to someone else.
    //returns bool success ala erc20?
    function transfer(address _to, uint256 _tokenId) tokenExists(_tokenId) public {
        require(tokenOwner[_tokenId] == msg.sender); //sender must be owner
        require(_to != 0); //not allowed to burn in transfer method

        //transfer token
        internalTransfer(msg.sender, _to, _tokenId);
    }

    function internalApprove(address _owner, address _to, uint256 _tokenId) internal {
        require(tokenOwner[_tokenId] == _owner); //must be owner of the token to set approval
        require(_to != _owner); //can't approve to same address

        address oldApprovedAddress = allowed[_tokenId];
        allowed[_tokenId] = _to;

        if((oldApprovedAddress == 0 && _to != 0) //set new approval
        || (oldApprovedAddress != 0 && _to != 0) //change/reaffirm approval
        || (oldApprovedAddress != 0 && _to == 0)) { //clear approval
            Approval(_owner, _to, _tokenId);
        }
    }

    function internalTransfer(address _from, address _to, uint256 _tokenId) internal {
        removeToken(_from, _tokenId);
        addToken(_to, _tokenId);

        Transfer(_from, _to, _tokenId);
    }

    function removeToken(address _from, uint256 _tokenId) internal {
        //clear pending approvals
        internalApprove(_from, 0, _tokenId);

        uint256 index = tokenIndexInOwnerArray[_tokenId];

        //1) Put last item into index of token to be removed.
        ownedTokens[_from][index] = ownedTokens[_from][balances[_from]-1];
        //2) delete last item (since it's now a duplicate)
        delete ownedTokens[_from][balances[_from]-1];
        //3) reduce length of array
        ownedTokens[_from].length -= 1;
        balances[_from] -= 1;
    }

    function addToken(address _to, uint256 _tokenId) internal {
        tokenOwner[_tokenId] = _to;
        ownedTokens[_to].push(_tokenId);
        tokenIndexInOwnerArray[_tokenId] = ownedTokens[_to].length-1;
        balances[_to] += 1;
    }

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    // Optionals

    //a more specific transferFrom
    function takeOwnership(uint256 _tokenId) public {
        address _from = tokenOwner[_tokenId];
        transferFrom(_from, msg.sender, _tokenId);
    }

    //helper function to get a specific token (eg by iterating and fetching all of it)
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256) {
        require(_index >= 0 && _index < balanceOf(_owner));
        return ownedTokens[_owner][_index];
    }

    function getAllTokens(address _owner) public view returns (uint256[]) {
        uint size = balances[_owner];
        uint[] memory result = new uint256[](size);
        for (uint i = 0; i < size; i++) {
            result[i] = ownedTokens[_owner][i];
        }
        return result;
    }
}
