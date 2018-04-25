pragma solidity ^0.4.21;
import "./EIP721Interface.sol";
import "./EIP721MetadataInterface.sol";
import "./EIP721EnumerableInterface.sol";
import "./EIP721TokenReceiverInterface.sol";

/*
This is a full implementation of all ERC721's features.
Influenced by OpenZeppelin's implementation with some stylistic changes.
https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts/token/ERC721
*/

contract EIP721 is EIP721Interface, EIP721MetadataInterface, EIP721EnumerableInterface, ERC165Interface {
    string public name;
    string public symbol;

    // all tokens
    uint256[] internal allTokens;
    mapping(uint256 => uint256) internal allTokensIndex;
    // Array of tokens owned by a specific owner
    mapping(address => uint256[]) internal ownedTokens;
    // Mapping from token ID to owner
    mapping(uint256 => address) internal ownerOfToken;
    // Mapping of the token ID to where it is in the owner's array.
    mapping(uint256 => uint256) internal ownedTokensIndex;

    // Mapping of a token to a specifically approved owner.
    mapping(uint256 => address) internal approvedOwnerOfToken;

    // An operator is allowed to manage all assets of another owner.
    mapping(address => mapping (address => bool)) internal approvedOperators;

    mapping(uint256 => string) internal tokenURIs;

    // base ERC721 interface = 0x80ac58cd
    // metadata interface = 0x5b5e139f
    // enumerable interface = 0x780e9d63
    bytes4 internal constant ERC721_BASE_INTERFACE_SIGNATURE = 0x80ac58cd;
    bytes4 internal constant ERC721_METADATA_INTERFACE_SIGNATURE = 0x5b5e139f;
    bytes4 internal constant ERC721_ENUMERABLE_INTERFACE_SIGNATURE = 0x780e9d63;

    /* Modifiers */
    modifier tokenExists(uint256 _tokenId) {
        require(ownerOfToken[_tokenId] != 0);
        _;
    }

    // checks: is the owner of the token == msg.sender?
    // OR has the owner of the token granted msg.sender access to operate?
    modifier allowedToOperate(uint256 _tokenId) {
        require(checkIfAllowedToOperate(_tokenId));
        _;
    }

    modifier allowedToTransfer(address _from, address _to, uint256 _tokenId) {
        require(checkIfAllowedToOperate(_tokenId) || approvedOwnerOfToken[_tokenId] == msg.sender);
        require(ownerOfToken[_tokenId] == _from);
        require(_to != 0); //not allowed to burn in transfer method
        _;
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable
    tokenExists(_tokenId)
    allowedToTransfer(_from, _to, _tokenId) {
        //transfer token
        settleTransfer(_from, _to, _tokenId);
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable
    tokenExists(_tokenId)
    allowedToTransfer(_from, _to, _tokenId) {
        settleTransfer(_from, _to, _tokenId);

        // check if a smart contract
        uint256 size;
        assembly { size := extcodesize(_to) }  // solhint-disable-line no-inline-assembly
        if (size > 0) {
            // call on onERC721Received.
            require(EIP721TokenReceiverInterface(_to).onERC721Received(_from, _tokenId, data) == 0xf0b9e5ba);
        }
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to ""
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable
    tokenExists(_tokenId)
    allowedToTransfer(_from, _to, _tokenId) {
        settleTransfer(_from, _to, _tokenId);

        // check if a smart contract
        uint256 size;
        assembly { size := extcodesize(_to) }  // solhint-disable-line no-inline-assembly
        if (size > 0) {
            // call on onERC721Received.
            require(EIP721TokenReceiverInterface(_to).onERC721Received(_from, _tokenId, "") == 0xf0b9e5ba);
        }
    }

    /// @notice Set or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    /// @dev Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable
    tokenExists(_tokenId)
    allowedToOperate(_tokenId) {
        address owner = ownerOfToken[_tokenId];
        internalApprove(owner, _approved, _tokenId);
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all of `msg.sender`'s assets.
    /// @dev Emits the ApprovalForAll event. The contract MUST allow
    ///  multiple operators per owner.
    /// @param _operator Address to add to the set of authorized operators.
    /// @param _approved True if the operator is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external {
        require(_operator != msg.sender); // can't make oneself an operator
        approvedOperators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    /* public View Functions */
    /// @notice Count NFTs tracked by this contract
    /// @return A count of valid NFTs tracked by this contract, where each one of
    ///  them has an assigned and queryable owner not equal to the zero address
    function totalSupply() external view returns (uint256) {
        return allTokens.length;
    }

    /// @notice Find the owner of an NFT
    /// @param _tokenId The identifier for an NFT
    /// @dev NFTs assigned to zero address are considered invalid, and queries
    ///  about them do throw.
    /// @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) external view
    tokenExists(_tokenId) returns (address) {
        return ownerOfToken[_tokenId];
    }

    /// @notice Enumerate valid NFTs
    /// @dev Throws if `_index` >= `totalSupply()`.
    /// @param _index A counter less than `totalSupply()`
    /// @return The token identifier for the `_index`th NFT,
    ///  (sort order not specified)
    function tokenByIndex(uint256 _index) external view returns (uint256) {
        require(_index < allTokens.length);
        return allTokens[_index];
    }

    /// @notice Enumerate NFTs assigned to an owner
    /// @dev Throws if `_index` >= `balanceOf(_owner)` or if
    ///  `_owner` is the zero address, representing invalid NFTs.
    /// @param _owner An address where we are interested in NFTs owned by them
    /// @param _index A counter less than `balanceOf(_owner)`
    /// @return The token identifier for the `_index`th NFT assigned to `_owner`,
    ///   (sort order not specified)
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view
    tokenExists(_tokenId) returns (uint256 _tokenId) {
        require(_index < ownedTokens[_owner].length);
        return ownedTokens[_owner][_index];
    }

    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///  function throws for queries about the zero address.
    /// @param _owner An address for whom to query the balance
    /// @return The number of NFTs owned by `_owner`, possibly zero
    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != 0);
        return ownedTokens[_owner].length;
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT
    /// @param _tokenId The NFT to find the approved address for
    // todo: The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view
    tokenExists(_tokenId) returns (address) {
        return approvedOwnerOfToken[_tokenId];
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return approvedOperators[_owner][_operator];
    }

    /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    ///  3986. The URI may point to a JSON file that conforms to the "ERC721
    ///  Metadata JSON Schema".
    function tokenURI(uint256 _tokenId) external view returns (string) {
        return tokenURIs[_tokenId];
    }

    /// @notice Query if a contract implements an interface
    /// @param interfaceID The interface identifier, as specified in ERC-165
    /// @dev Interface identification is specified in ERC-165. This function
    ///  uses less than 30,000 gas.
    /// @return `true` if the contract implements `interfaceID` and
    /// `interfaceID` is not 0xffffffff, `false` otherwise
    function supportsInterface(bytes4 interfaceID) external view returns (bool) {

        if (interfaceID == ERC721_BASE_INTERFACE_SIGNATURE ||
        interfaceID == ERC721_METADATA_INTERFACE_SIGNATURE ||
        interfaceID == ERC721_ENUMERABLE_INTERFACE_SIGNATURE) {
            return true;
        } else { return false; }
    }

    /* -- Internal Functions -- */
    function checkIfAllowedToOperate(uint256 _tokenId) internal view returns (bool) {
        return ownerOfToken[_tokenId] == msg.sender || approvedOperators[ownerOfToken[_tokenId]][msg.sender];
    }

    function internalApprove(address _owner, address _approved, uint256 _tokenId) internal {
        require(_approved != _owner); //can't approve to owner to itself

        // Note: the following code is equivalent to: require(getApproved(_tokenId) != 0) || _approved != 0);
        // However: I found the following easier to read & understand.
        if (approvedOwnerOfToken[_tokenId] == 0 && _approved == 0) {
            revert(); // add reason for revert?
        } else {
            approvedOwnerOfToken[_tokenId] = _approved;
            emit Approval(_owner, _approved, _tokenId);
        }
    }

    function settleTransfer(address _from, address _to, uint256 _tokenId) internal {
        //clear pending approvals if there are any
        if (approvedOwnerOfToken[_tokenId] != 0) {
            internalApprove(_from, 0, _tokenId);
        }

        removeToken(_from, _tokenId);
        addToken(_to, _tokenId);

        emit Transfer(_from, _to, _tokenId);
    }

    function addToken(address _to, uint256 _tokenId) internal {
        allTokens.push(_tokenId);
        allTokensIndex[_tokenId] = allTokens.length-1;

        // set token to be owned by address _to
        ownerOfToken[_tokenId] = _to;
        // add that token to an array keeping track of tokens owned by that address
        ownedTokens[_to].push(_tokenId);
        // shorten length
        ownedTokensIndex[_tokenId] = ownedTokens[_to].length-1;
    }

    function removeToken(address _from, uint256 _tokenId) internal {

        // remove token from allTokens array.
        uint256 allIndex = allTokensIndex[_tokenId];
        uint256 allTokensLength = allTokens.length;
        //1) Put last item into index of token to be removed.
        allTokens[allIndex] = allTokens[allTokensLength - 1];
        allTokensIndex[allTokensLength - 1] = allIndex;
        //2) delete last item (since it's now a duplicate)
        delete allTokens[allTokensLength-1];
        //3) reduce length of array
        allTokens.length -= 1;

        // remove token from owner array.
        // get the index of where this token is in the owner's array
        uint256 ownerIndex = ownedTokensIndex[_tokenId];
        uint256 ownerLength = ownedTokens[_from].length;
        /* Remove Token From Index */
        //1) Put last item into index of token to be removed.
        ownedTokens[_from][ownerIndex] = ownedTokens[_from][ownerLength-1];
        ownedTokensIndex[ownerLength-1] = ownerIndex;
        //2) delete last item (since it's now a duplicate)
        delete ownedTokens[_from][ownerLength-1];
        //3) reduce length of array
        ownedTokens[_from].length -= 1;

        delete ownerOfToken[_tokenId];
    }
}
