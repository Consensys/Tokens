pragma solidity ^0.4.0;
import './PullPayment.sol';
import '../HumanStandardToken.sol';

/*
 * HumanStandardTokenBounty
 * This bounty will pay out if you can cause a HumanStandardToken's balance
 * to be lower than its totalSupply, which would mean that it doesn't 
 * have sufficient ether for everyone to withdraw.
 */
contract HumanStandardTokenBounty is PullPayment {

  bool public claimed;
  mapping(address => address) public researchers;

  function() {
    if (claimed) throw;
  }

  function createTarget() returns(HumanStandardToken) {
    uint256 initialSupply = 5000;
    string memory name = "Human Standard Token X";
    uint8 decimals = 8;
    string memory symbol = "HSX";

    HumanStandardToken target = new HumanStandardToken(initialSupply, name, decimals, symbol);
    researchers[target] = msg.sender;
    return target;
  }

  function claim(HumanStandardToken target) {
    address researcher = researchers[target];
    if (researcher == 0) throw;
    // check HumanStandardToken contract invariants
    if (target.totalSupply() == target.balance) {
      throw;
    }
    asyncSend(researcher, this.balance);
    claimed = true;
  }

}
