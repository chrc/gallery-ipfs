pragma solidity ^0.6.0;

library SafeMath8 {

  function add(uint8 a, uint8 b) internal pure returns (uint8) {
    uint8 c = a + b;
    require(c >= a, "SafeMath uint8: addition overflow");
    return c;
  }
}
