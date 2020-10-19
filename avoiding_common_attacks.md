# Avoiding Common Attacks

## Security

We follow the [Solidity Security recommendations](https://solidity.readthedocs.io/en/v0.6.0/security-considerations.html#recommendations)

## **1. Require to check inputs**

To check user inputs from bad value, we use the require statement, and throw exception if needed.

For example, the IPFS hash must be unique into the smart contract storage.   

## **2. Tx.origin**

The contract uses msg.sender instead of tx.origin.

## **3. Integer Overflow and/or Underflow**

No extra mathematical calculations are performed into the contract.  
Only add count of users and medias saved is compute.

So we create an Addition library like [OpenZeppelin SafeMath](https://docs.openzeppelin.com/contracts/3.x/api/math#SafeMath), for safe math operations.

## **4. DoS with Block Gas Limit**

We do loop over arrays of undetermined length.  
It is about retrieve all owner's IPFS Hash stored in a array.

To reduce the chance of the gas cost exceeding the gas limit, we use a limitation
to the length of owner's hash (cf. `maxMediasByOwner`).

---

### References

* [Known Attacks](https://consensys.github.io/smart-contract-best-practices/known_attacks/)
* [A survey of attacks on Ethereum smart contracts](https://eprint.iacr.org/2016/1007.pdf)
* [A list of known bugs from the Solidity docs](https://solidity.readthedocs.io/en/develop/bugs.html)
