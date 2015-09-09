contract Coin {
    function sendCoin(uint _value, address _to) returns (bool _success) {}
    function sendCoinFrom(address _from, uint _value, address _to) returns (bool _success) {}
    function coinBalance() constant returns (uint _r) {}
    function coinBalanceOf(address _addr) constant returns (uint _r) {}
    function approve(address _addr) {}
    function approveOnce(address _addr, uint256 _maxValue) {}
    function unapprove(address _addr) {}
    function isApproved(address _proxy) constant returns (bool _r) {}
    function isApprovedFor(address _target, address _proxy) constant returns (bool _r) {}
}
