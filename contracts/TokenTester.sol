pragma solidity ^0.4.8;

import "./HumanStandardTokenFactory.sol";

//commented out for now as Factory > 3m gas to deploy, causing this to OOG.
contract TokenTester {
    address public tokenContractAddress;

    /*function TokenTester() {
        address factoryAddr = address(new HumanStandardTokenFactory());
        HumanStandardTokenFactory tokenFactory = HumanStandardTokenFactory(factoryAddr);

        tokenContractAddress = tokenFactory.createHumanStandardToken(10000, 'Simon Bucks', 1, 'SBX');
    }*/
}
