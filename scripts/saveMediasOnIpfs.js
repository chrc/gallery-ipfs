const fs = require('fs');
const IpfsHttpClient = require('ipfs-http-client');
const medias = require('../data/medias');

const { globSource, urlSource } = IpfsHttpClient;

const {
  REACT_APP_IPFS_PROTOCOL,
  REACT_APP_IPFS_HOST,
  REACT_APP_IPFS_API_PORT,
} = process.env;

const ipfsInstance = IpfsHttpClient({
  protocol: REACT_APP_IPFS_PROTOCOL,
  host: REACT_APP_IPFS_HOST,
  port: REACT_APP_IPFS_API_PORT,
});

const getHashFromUrlFileAddedToIpfs = async (urlFile) => {
  try {
    let result;
    if (urlFile.startsWith('http')) {
      result = await ipfsInstance.add(urlSource(urlFile));
    } else {
      result = await ipfsInstance.add(globSource(urlFile));
    }
    return result.cid.toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const saveToIpfsMediasFile = async (listOfMedias) => {
  try {
    const data = await Promise.all(
      listOfMedias.map(async (media) => {
        const hash = await getHashFromUrlFileAddedToIpfs(media.source);

        return {
          hash,
          type: media.type,
          title: media.title,
          tags: media.tags,
        };
      }),
    );

    fs.writeFileSync('data/ipfsMedias.json', JSON.stringify(data));
  } catch (err) {
    console.error('Error occured while reading directory!', err);
  }
};

saveToIpfsMediasFile(medias);
