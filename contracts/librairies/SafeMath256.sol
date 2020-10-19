pragma solidity ^0.6.0;

library SafeMath256 {

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath uint256: addition overflow");
    return c;
  }
}
