contract Token {
    function transfer(uint _value, bytes32 _identifier, address _to) returns (bool _success) {}
    function transferFrom(address _from, bytes32 _identifier, uint _value, address _to) returns (bool _success) {}
    function balanceOf(address _addr, bytes32 _identifier) constant returns (uint _r) {}
    function approve(address _addr, bytes32 _identifier) returns (bool _success) {}
    function unapprove(address _addr, bytes32 _identifier) returns (bool _success) {}
    function isApprovedFor(address _target, bytes32 _identifier, address _proxy) constant returns (bool _r) {} 
    function approveOnce(address _addr, bytes32 _identifier, uint256 _maxValue) returns (bool _success) {}
    function isApprovedOnceFor(address _target,  bytes32 _identifier, address _proxy) constant returns (uint _maxValue) {}
    function totalAmount(bytes32 _identifier) constant returns (uint _totalAmount) {}
    
    event Transfer(address indexed from, bytes32 _identifier, address indexed to, uint256 value);
    event AddressApproval(address indexed addr, bytes32 _identifier, address indexed proxy, bool result);
    event AddressApprovalOnce(address indexed addr, bytes32 _identifier, address indexed proxy, uint256 value);
}
