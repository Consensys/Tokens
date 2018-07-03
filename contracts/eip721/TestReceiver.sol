pragma solidity ^0.4.24;
import "./EIP721TokenReceiverInterface.sol";


contract TestReceiver is EIP721TokenReceiverInterface {

  /// @notice Handle the receipt of an NFT
  /// Note: the application will get the prior owner of the token
  ///  after a `transfer`. This function MAY throw to revert and reject the
  ///  transfer. Return of other than the magic value MUST result in the
  ///  transaction being reverted.
  ///  Note: the contract address is always the message sender.
  /// @param _operator The address which called `safeTransferFrom` function
  /// @param _from The address which previously owned the token
  /// @param _tokenId The NFT identifier which is being transferred
  /// @param _data Additional data with no specified format
  /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
  ///  unless throwing
    function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes _data) external returns(bytes4) { //solhint-disable-line no-unused-vars
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }
}
