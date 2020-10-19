pragma solidity >= 0.6.0 < 0.7.0;

/**
 * @file GalleryContract.sol
 * @author Christophe CHARLES <christophe.charles@octo.com>
 * @version 1.0
 *
 * @notice This Gallery contract allows to save the hash
 * of a media (image or video) in the IPFS network.
 */


/**
 * @notice Importing Ownable contract (v3.2.0), and using inheritance.
 *
 * This contract provides a basic access control mechanism, where there is
 * an account (an owner) that can be granted exclusive access to specific functions.
 *
 * It will make available the modifier onlyOwner, which can be applied
 * to restrict their use to the owner.
 */
import "@openzeppelin/contracts/access/Ownable.sol";

import "./librairies/SafeMath8.sol";
import "./librairies/SafeMath256.sol";

contract GalleryContract is Ownable {

  using SafeMath8 for uint8;
  using SafeMath256 for uint256;

  enum MediaType { Image, Video }

  struct Media {
    bytes32 hash;         // IPFS hash (without 'Qm')
    address owner;        // Owner's media
    MediaType mediaType;  // Media type
    string title;         // Media title
    string tags;          // Tags with comma separation
    uint createdAt;       // Timestamp
  }

  // -------  State variables

  bool private activatedContract = true;

  uint8 private galleryOwnersCount = 0; // Total number of owners's media
  uint256 private galleryMediasCount = 0; // Total number of medias saved

  uint private lastDateSavedMedia;     // Timestamp of the last saved media

  uint private maxMediasByOwner; // Maximum medias allowed by owner

  mapping (address => bytes32[]) public ownersHashes; // Mapping of owner's hashes medias
  mapping (bytes32 => Media) public mediasByHash;     // Mapping of hash's media

  // -------

  /**
   * @notice Funds has arrived into the wallet (record how much).
   *
   * @param _from sender address
   * @param value ether send
   */
  event EventDeposit(address _from, uint value);

  /**
   * @dev Emitted when the contract's owner toggle activation contract.
   *
   * @param contractActivation boolean
   */
  event EventContractActivation(bool contractActivation);

  /**
   * @dev Emitted when an user has saved a new media.
   * `owner` is the account that originated the contract call.
   *
   * @param hash IPFS hash
   * @param owner Owner of media
   * @param mediaType Media type
   * @param title Media title
   * @param tags Media tags
   * @param createdAt Timestamp
   */
  event EventSavedMedia(
    bytes32 indexed hash,
    address indexed owner,
    MediaType mediaType,
    string title,
    string tags,
    uint createdAt
  );

  /**
   * @dev Modifier: Against prohibited execution
   */
  modifier stopIfInactiveContract {
    require(activatedContract, "You cannot use this contract!");
    _;
  }

  /**
   * @dev Constructor: Initializes the contract setting the deployer as the initial owner.
   *
   * @param _maxMediasByOwner uint8 Number of maximum medias allowed by owner.
   */
  constructor(uint8 _maxMediasByOwner) public {
    maxMediasByOwner = _maxMediasByOwner;
  }

  /*
   * @notice Gets called when no other function matches.
   */
  fallback() external {
  }

  /*
   * @notice Gets called when ether is send to the contract.
   */
  receive() payable external {
    if (msg.value > 0) {
      emit EventDeposit(msg.sender, msg.value);
    }
  }

  /**
   * @dev Activate or deactivate this contract (circuit breaker pattern).
   */
  function toggleContractActivation() public onlyOwner {
    activatedContract = !activatedContract;
    emit EventContractActivation(activatedContract);
  }

  /**
   * @notice Retrieve the activated status of the contract
   * @return active boolean
   */
  function getActivatedContract() public view returns(bool active) {
    return activatedContract;
  }

  /**
   * @dev Set the maximum medias by owner.
   *
   * @param _maxMediasByOwner number
   */
  function setMaxMediasByOwner(uint _maxMediasByOwner) public onlyOwner {
    maxMediasByOwner = _maxMediasByOwner;
  }

  /**
   * @notice Return the maximum medias by owner.
   *
   * @return maxMedias
   */
  function getMaxMediasByOwner() public view returns(uint maxMedias) {
    return maxMediasByOwner;
  }

  /**
   * @notice Return the number of owner's media.
   *
   * @return ownersCount
   */
  function getGalleryOwnersCount() public view returns(uint ownersCount) {
    return galleryOwnersCount;
  }

  /**
   * @notice Return the number of medias saved.
   *
   * @return mediasCount
   */
  function getGalleryMediasCount() public view returns(uint mediasCount) {
    return galleryMediasCount;
  }

  /**
   * @notice Return the date of the last recorded media.
   *
   * @return lastRecordedDate
   */
  function getLastDateSavedMedia() public view returns(uint lastRecordedDate) {
    return lastDateSavedMedia;
  }


  /**
  * @notice Save all owner's media parameters
  *
  * @dev Use the circuit breaker pattern.
  * Emits an {EventSavedMedia} event.
  *
  * @param _hash IPFS hash
  * @param _mediaType Media type
  * @param _title Media title
  * @param _tags Media tags
  *
  * @return boolean
  */
  function saveMedia(
      bytes32 _hash,
      MediaType _mediaType,
      string memory _title,
      string memory _tags)
    public stopIfInactiveContract
    returns (bool)
  {
    require(ownersHashes[msg.sender].length < maxMediasByOwner, "You have reached the maximum number of media you can record.");

    require(mediasByHash[_hash].owner == address(0x0), "IPFS hash already exist");

    require(bytes(_title).length > 0, "You must provide a title!");
    require(bytes(_tags).length > 0, "You must provide tag!");

    if (ownersHashes[msg.sender].length == 0) {
      galleryOwnersCount = galleryOwnersCount.add(1);
    }

    uint _createdAt = block.timestamp;
    Media memory _media = Media(
      _hash,
      msg.sender,
      _mediaType,
      _title,
      _tags,
      _createdAt
    );

    mediasByHash[_hash] = _media;
    ownersHashes[msg.sender].push(_hash);

    galleryMediasCount = galleryMediasCount.add(1);
    lastDateSavedMedia = _createdAt;

    emit EventSavedMedia(_hash, msg.sender, _mediaType, _title, _tags, _createdAt);

    return true;
  }

  /**
   * @notice Retrieve media by hash
   *
   * @param _hash IPFS hash to search
   * @return hash
   * @return owner
   * @return mediaType
   * @return title
   * @return tags
   * @return createdAt
   */
  function getMediaByHash(bytes32 _hash)
    public view returns (
      bytes32 hash,
      address owner,
      MediaType mediaType,
      string memory title,
      string memory tags,
      uint createdAt)
  {
    Media memory media = mediasByHash[_hash];
    return (
      media.hash, media.owner, media.mediaType, media.title, media.tags, media.createdAt
    );
  }

  /**
   * @notice Retrieve media's hashes by owner's address
   *
   * @param _address owner's media address
   * @return owner owner's media address
   * @return hashes array of hashes (in bytes32)
   */
  function getHashesByAddress(address _address)
    public view returns (address owner, bytes32[] memory hashes)
  {
    bytes32[] memory _hashes = new bytes32[](ownersHashes[_address].length);
    for (uint i = 0; i < ownersHashes[_address].length; i++) {
      _hashes[i] = ownersHashes[_address][i];
    }

    return (_address, _hashes);
  }

  /**
   * @notice Retrieve a part of the medias with hash and media type, by owner's address
   *
   * @param _address owner's media address
   * @return owner owner's media address
   * @return hashes array of hashes (in bytes32)
   * @return mediaTypes array of MediaType
   */
  function getPartOfMediasByAddress(address _address)
    public view returns (address owner, bytes32[] memory hashes, MediaType[] memory mediaTypes)
  {
    bytes32[] memory _hashes = new bytes32[](ownersHashes[_address].length);
    MediaType[] memory _mediaTypes = new MediaType[](ownersHashes[_address].length);
    for (uint i = 0; i < ownersHashes[_address].length; i++) {
      _hashes[i] = ownersHashes[_address][i];
      _mediaTypes[i] = mediasByHash[_hashes[i]].mediaType;
    }

    return (_address, _hashes, _mediaTypes);
  }

  /*
   * @notice The only way to remove code from the blockchain is when
   * a contract at that address performs the "selfdestruct" operation.
   * The remaining Ether stored at that address is sent to a designated target
   * and then the storage and code is removed from the state.
   *
   * @dev This function destroy the contract and reclaim the leftover funds,
   * by casting owner to address payable.
   */
  function kill() public onlyOwner {
    selfdestruct(address(uint160(owner())));
  }

}
