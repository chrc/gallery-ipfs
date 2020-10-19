require('dotenv').config();

const Base58 = require('bs58');

const {
  MAX_MEDIAS_BY_OWNER,
  NODE_ENV,
  PRE_FILL_DATA,
} = process.env;

/**
 * Array of MEDIAS to be save into the blockchain
 * ex.
 * [
 *   {
 *     hash: 'QmbYTD8ZRbbF9zGNzQ6cuaw5GAiaASa2dwYXhxfBX7qW3D',
 *     type: 'image',
 *     title: 'My Title',
 *     tags: 'tag1,tag2,image',
 *   },
 *   {
 *     hash: 'QmdZ1zDxbFQKKLQsXEGvasAnwD4uNiD9SMprvvZsLTmLh3',
 *     type: 'video',
 *     title: 'My second title',
 *     tags: 'video, tag10, tag11',
 *   },
 *   ...
 * ]
 */
const ipfsMedias = require('../data/ipfsMedias.json');

const convertBase58ToHex = (ipfsHash) => {
  // return without 'Qm'
  const hex = Base58.decode(ipfsHash).toString('hex').substring(4);
  return `0x${hex}`;
};

const hasMediasToBeSave = () => {
  const isTest = NODE_ENV === 'test';
  const preFillData = PRE_FILL_DATA === 'true';

  return !isTest && preFillData;
};

const GalleryContract = artifacts.require('GalleryContract.sol');

module.exports = function (deployer) {
  deployer.deploy(GalleryContract, MAX_MEDIAS_BY_OWNER)
    .then(() => GalleryContract.deployed())
    .then((instance) => {
      if (hasMediasToBeSave()) {
        ipfsMedias.forEach((data) => {
          instance.saveMedia(
            convertBase58ToHex(data.hash),
            data.type === 'image' ? 0 : 1,
            data.title,
            data.tags,
          );
        });
      }
    });
};
