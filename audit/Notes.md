# My own findings and comments

## Array length undeflows

I'm worried about underflow in the `removeToken()` function, on these lines:


    allTokens.length -= 1; ownedTokens[_from].length -= 1;

I haven't spent time on it, but I think in edge cases things will break.

## Very storage heavy!

Let's see if there's a possibility of reducing storage costs... one idea is to simply store a an
array of bools, instead of an array of uints AND a mapping of uints to array indices.


## Modifier and visibility indentation

I found the modifier indentation quite difficult to read. ie.

```
function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable
tokenExists(_tokenId) allowedToTransfer(_from, _to, _tokenId) { doSomething(); }
```

would be better as:

```
function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable
    tokenExists(_tokenId) allowedToTransfer(_from, _to, _tokenId) { doSomething(); }
```

## tokenURIs

This implementation has no means of writing to the tokenURIs mapping, so all that functionality is extraneous.


# Requested comments

## Please Double Check Conformity to EIP721 standard

I've read through the entire contract quite carefully. I should still go through the various throw
conditions more carefully.

## Naming

I agree that the variable names can get confusing,

Possible suggestions for these two:

    uint256[] internal allTokens; // -> tokensArr; mapping(uint256 => uint256) internal
    allTokensIndex; // -> indexOfToken;

    mapping(uint256 => address) internal approvedOwnerOfToken; // -> approvedSpenderOfToken


## No Function To Retrieve Token Arrays

I don't think solidity supports returning arrays yet. When I try this I get:

> This type is only supported in the new experimental ABI encoder. Use "pragma experimental 
> ABIEncoderV2;" to enable the feature.


## Default Payable?

> For example, a payable function in this interface may be implemented as nonpayble 
> [ref](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md#caveats)

I would say no. Unless the original internal dapps deploying this contract want it, I think payable should be removed. 


## Data in a solidity call 

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable

I'm of the impression that sending data in a solidity call is somewhat broken due to padding issues? Need to verify that, Goncalo will know.

## Blocking onERC721Received (Max 50k gas)

I don't know the reason for this gas use constraint, but EIP-165 is quite strict on gas, and this function seems to exist for similar reasons to EIP-165.


## Revert Reason

I think this is a good opportunity to test it out! But if it's going to lead to bikeshed, not worth it.


## Naming Implementation

The method used requires more gas, becuase it reads from storage. The EIP version presumably puts the data inline.

```
// 21877 gas
// 605 gas
string public symbol = "NFT";


// 22712 gas
// 1440 gas
function getSymbol() external pure returns (string _name) {
    return 'NFT';
}
```

However, I also prefer the readability of your approach, `string public constant symbol = "NFT";` is 21891 and 619 gas, but breaks the "constants are all-caps" convention.


