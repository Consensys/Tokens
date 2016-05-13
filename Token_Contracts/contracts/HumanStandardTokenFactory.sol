import "HumanStandardToken.sol";

contract HumanStandardTokenFactory {

    mapping(address => address[]) public created;

    function createdByMe() returns (address[]) {
        return created[msg.sender];
    }

    function createHumanStandardToken(uint256 _initialAmount, string _name, uint8 _decimals, string _symbol) returns (address) {

        address newTokenAddr = address(new HumanStandardToken(_initialAmount, _name, _decimals, _symbol));
        HumanStandardToken newToken = HumanStandardToken(newTokenAddr);
        newToken.transfer(msg.sender, _initialAmount); //the factory will own the created tokens. You must transfer them.
        created[msg.sender].push(newTokenAddr);
        return newTokenAddr;
    }
}
