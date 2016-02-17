import "Standard_Token.sol";

contract Standard_Token_Factory {

    mapping(address => address[]) public created;

    function createdByMe() returns (address[]) {
        return created[msg.sender];
    }

    function createStandardToken(uint256 _initialAmount) returns (address) {

        address newTokenAddr = address(new Standard_Token(_initialAmount));
        Standard_Token newToken = Standard_Token(newTokenAddr);
        newToken.transfer(msg.sender, _initialAmount); //the factory will own the created tokens. You must transfer them.
        created[msg.sender].push(newTokenAddr);
        return newTokenAddr;
    }
}
