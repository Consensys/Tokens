contract Token {
    
    function Token() {
        owner = msg.sender;
    }
    
    modifier isOwner {
        if (msg.sender == owner) {
            _
        }
    }
    
    //only owner can currently create new tokens.
    //change as needed.
    function createToken(address _to, uint _amount) isOwner {
        balances[_to] += _amount; //check if can be done from unitialised acc
    }
    
    function sendToken(address _to, uint _amount) {
        if (balances[msg.sender] >= _amount) {
            balances[msg.sender] -= _amount;
            balances[_to] += _amount;
        }
    }
    
    address public owner;
    mapping (address => uint) public balances; //how does this work?
}
