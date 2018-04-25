pragma solidity ^0.4.21;


/// @title ERC-721 Non-Fungible Token Standard, optional metadata extension
/// @dev See https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
///  Note: the ERC-165 identifier for this interface is 0x5b5e139f
/*
Note on implementation:
EIP721 defines visbility, originally as 'external pure', however this is only possible if you hardcode
the name & symbol into the contract. eg

function name() external pure returns (string _name) {
    return 'NFT name';
}

However, I don't think is meaningful. This is the only 2 functions that aren't not
implemented as expected. It does not however change the interface signature.
*/
interface EIP721MetadataInterface {
    /// @notice A descriptive name for a collection of NFTs in this contract
    // function name() external pure returns (string _name);

    /// @notice An abbreviated name for NFTs in this contract
    // function symbol() external pure returns (string _symbol);

    /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    ///  3986. The URI may point to a JSON file that conforms to the "ERC721
    ///  Metadata JSON Schema".
    function tokenURI(uint256 _tokenId) external view returns (string);
}
