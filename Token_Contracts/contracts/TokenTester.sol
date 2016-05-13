import "HumanStandardTokenFactory.sol";

contract TokenTester {
    address public tokenContractAddress;

    function TokenTester() {
        address factoryAddr = address(new HumanStandardTokenFactory());
        HumanStandardTokenFactory tokenFactory = HumanStandardTokenFactory(factoryAddr);

        tokenContractAddress = tokenFactory.createHumanStandardToken(10000, 'Simon Bucks', 1, 'SBX');
    }
}
