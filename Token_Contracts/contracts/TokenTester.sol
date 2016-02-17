import "Standard_Token_Factory.sol";

contract TokenTester {
    address public tokenContractAddress;

    function TokenTester() {
        address factoryAddr = address(new Standard_Token_Factory());
        Standard_Token_Factory tokenFactory = Standard_Token_Factory(factoryAddr);

        tokenContractAddress = tokenFactory.createStandardToken(10000);
    }
}
