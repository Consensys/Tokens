pragma solidity ^0.4.18;


/// @title Interface for contracts conforming to ERC-721: Non-Fungible Tokens
/// @author Dieter Shirley <dete@axiomzen.co> (https://github.com/dete)
contract ERC721Interface {

    // Not implemented ATM
    //TODO: should this be done vs https://github.com/ethereum/EIPs/issues/165?
    // function implementsERC721() public pure returns (bool);


    function balanceOf(address _owner) public view returns (uint256 balance);

    function ownerOf(uint256 _tokenId) public view returns (address owner);

    function approve(address _to, uint256 _tokenId) public;

    function transferFrom(address _from, address _to, uint256 _tokenId) public;

    function transfer(address _to, uint256 _tokenId) public;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    // This function is implemented through a public variable (which creates appropriate method).
    // Solidity doesn't recognize those functions as "implementing the interface".
    // function totalSupply() public view returns (uint256 total);

    // OPTIONALS
    //just a more specific transferFrom
    function takeOwnership(uint256 tokenId) public; //specific transferFrom
    //helper function to get a specific token (eg by iterating and fetching all of it)
    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 tokenId);

    // These function are implemented through public variables (which creates appropriate methods).
    // Solidity doesn't recognize those functions as "implementing the interface".
    // function name() public view returns (string _name);
    // function symbol() public view returns (string _symbol);
    // function tokenMetadata(uint256 _tokenId) public view returns (string infoUrl);

}
