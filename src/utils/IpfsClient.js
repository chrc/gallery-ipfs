import IpfsHttpClient from 'ipfs-http-client';
import Base58 from 'bs58';
import web3 from 'web3';

const {
  REACT_APP_IPFS_PROTOCOL,
  REACT_APP_IPFS_HOST,
  REACT_APP_IPFS_API_PORT,
  REACT_APP_IPFS_GATEWAY_PORT,
} = process.env;

const initiatedData = {
  ownerAddress: null,
  hashes: [],
};

const initiatedMedia = {
  hash: null,
  owner: null,
  title: null,
  tags: [],
  createdAt: null,
  type: null,
  source: '',
};

const initiatedPartOfData = {
  ownerAddress: null,
  count: 0,
  images: [],
  videos: [],
};

const ipfsInstance = IpfsHttpClient({
  protocol: REACT_APP_IPFS_PROTOCOL,
  host: REACT_APP_IPFS_HOST,
  port: REACT_APP_IPFS_API_PORT,
});

const isVideo = (media) => media.type === 'video';

const addFile = async ({ fileBuffer }) => {
  try {
    const result = await ipfsInstance.add(fileBuffer);
    return result.path;
  } catch (error) {
    console.error(error);
  }
};

const addressToNumber = (address) => {
  const str = web3.utils.hexToNumberString(address);
  return parseInt(str, 10);
};

// return without 'Qm'
const convertBase58ToHex = (ipfsHash) => `0x${Base58.decode(ipfsHash).toString('hex').substring(4)}`;

const convertHexToIpfsHash = (_hex) => {
  // With 'Qm'
  const bytes = Buffer.from(`1220${_hex.substring(2)}`, 'hex');
  return Base58.encode(bytes);
};

const getIpfsGateway = () => {
  const gatewayPort = REACT_APP_IPFS_GATEWAY_PORT
    ? `:${REACT_APP_IPFS_GATEWAY_PORT}`
    : '';
  return `${REACT_APP_IPFS_PROTOCOL}://${REACT_APP_IPFS_HOST}${gatewayPort}`;
};

const getUrlSource = (hash) => `${getIpfsGateway()}/ipfs/${hash}`;

const transformToMedia = (foundMedia) => {
  let result = initiatedMedia;

  const {
    hash, owner, mediaType, title, tags, createdAt,
  } = foundMedia;

  if (addressToNumber(owner)) {
    const ipfsHash = convertHexToIpfsHash(hash);
    result = {
      hash: ipfsHash,
      owner,
      title,
      tags: tags.split(','),
      createdAt: parseInt(createdAt, 10),
      type: parseInt(mediaType, 10) === 0 ? 'image' : 'video',
      source: getUrlSource(ipfsHash),
    };
  }

  return result;
};

const transformToOwnerHashes = (foundData) => {
  let result = initiatedData;

  const { owner, hashes } = foundData;

  if (hashes.length > 0) {
    result = {
      ownerAddress: owner,
      hashes: hashes.map(convertHexToIpfsHash),
    };
  }

  return result;
};

const transformPartOfMedias = (foundData) => {
  let result = initiatedPartOfData;

  if (foundData) {
    const { owner, hashes, mediaTypes } = foundData;

    if (hashes.length > 0) {
      const medias = hashes.map((hex, index) => {
        const hash = convertHexToIpfsHash(hex);
        return {
          hash,
          type: parseInt(mediaTypes[index], 10) === 0 ? 'image' : 'video',
          source: getUrlSource(hash),
        };
      });

      result = {
        ownerAddress: owner,
        count: hashes.length,
        images: medias.filter((media) => !isVideo(media)),
        videos: medias.filter(isVideo),
      };
    }
  }

  return result;
};

const IpfsClient = {
  instance: ipfsInstance,
  addFile,
  getIpfsGateway,
  getUrlSource,
  convertIpfsHashToHex: convertBase58ToHex,
  convertHexToIpfsHash,
  initiatedPartOfData,
  saveMediaIntoIpfs: addFile,
  transformPartOfMedias,
  transformToMedia,
  transformToOwnerHashes,
};

export default IpfsClient;
