contract Token {
    function transfer(uint _value, address _to) returns (bool _success) {}
    function transferFrom(address _from, uint _value, address _to) returns (bool _success) {}
    function balanceOf(address _addr) constant returns (uint _r) {}
    function approve(address _addr) returns (bool _success) {}
    function unapprove(address _addr) returns (bool _success) {}
    function isApprovedFor(address _target, address _proxy) constant returns (bool _r) {}   
    function approveOnce(address _addr, uint256 _maxValue) returns (bool _success) {}
    function isApprovedOnceFor(address _target, address _proxy) constant returns (uint _maxValue) {}
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event AddressApproval(address indexed addr, address indexed proxy, bool result);
    event AddressApprovalOnce(address indexed addr, address indexed proxy, uint256 value);
}
