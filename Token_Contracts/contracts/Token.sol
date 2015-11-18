contract Token {
    function transfer(address _to, uint256 _value) returns (bool success) {}
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {}
    function balanceOf(address _address) constant returns (uint256 balance) {}
    function approve(address _address) returns (bool success) {}
    function unapprove(address _address) returns (bool success) {}
    function isApprovedFor(address _target, address _proxy) constant returns (bool success) {}
    function approveOnce(address _address, uint256 _maxValue) returns (bool success) {}
    function isApprovedOnceFor(address _target, address _proxy) constant returns (uint256 _maxValue) {}
    function totalSupply() constant returns (uint256 _total) {}

    event Transfer(address indexed _address, address indexed _to, uint256 _value);
    event AddressApproval(address indexed _address, address indexed _proxy, bool _result);
    event AddressApprovalOnce(address indexed _address, address indexed _proxy, uint256 _value);
}
