# Design Pattern Decisions

## **1. Restricting Access**

There is an Administrator role that has special permission and capabilities:
- Only for the Owner (of the contract):
    - Create the contract
    - Toggle contract activation
    - Selfdestruct the contract 
    - Change the maximum medias allowed by owner

A modifier is also used to allow method 
- Only if the contract is active
    - save a Media

## **2. Circuit breaker** 

An option is used to disable critical contract functionality in case of an emergency.   
Critical functionality such as save a Media.

## **3. Storing data in IPFS**

Blockchain shouldn't be used to store large amount of data.  
The Dapp uses IPFS to store media information (only the hash) in the blockchain.  
Then it uses this hash to retrieve the files from IPFS.

All hashes in IPFS are encoded as a MultiHash, a self-describing hash format.  
The binary representation consists of the hash code, the digest's length and value.  
The code and length are encoded as varints.  
The textual representation is usually the Base58 encoding of the binary format.
ex. `QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb`  

| Name          | Value                                                                  |
|---------------|------------------------------------------------------------------------|
| Hash code     | 0x12                                                                   |
| Digest length | 0x20                                                                   |
| Base 58       | QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb                         |
| Digest value  | 64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c       |
| Binary        | 12 20 64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c |

### bytes32 format

We choose to decode Base58 IPFS Hash to hexadecimal value,
and remove the '1220' starting value.  
So the `0x<HEXADECIMAL_VALUE>` wil be store into the smart contract.  
S0 this stored data is a bytes32 format value.

## **4. Limitation of saved data**

Because blockchain data store into smart contract can be expensive,  
we decide to limite the number of medias allowed by user (address). 
It would be much better to limit the total number of users also...

The maximum number of medias by user is set when the contract is create and migrate.  
It can be change (by the contract's owner) with `setMaxMediasByOwner()`.

## **5. Mortal**

To destroy the contract and remove it from the blockchain, then `kill()` function takes one parameter  
which is the address that will receive all the funds that the contract currently holds.  
As an irreversible action, restricting access to this function is important.

## **5. Fallback and Receive method**

Solidity fallback function executes in such cases:

* If other functions do not equal the provided identifier, it works on a call to the contract.
* If there is enough gas, this function can execute like any other method.

### Receive

Solidity 0.6.x introduced the `receive` keyword in order to make contracts more explicit when their fallback functions are called.  
The receive method is used as a fallback function in a contract and is called when ether is sent to a contract with no calldata.    
_If the receive method does not exist, it will use the fallback function._ 

---

### References

* [Smart contract best practices](https://consensys.github.io/smart-contract-best-practices/)
