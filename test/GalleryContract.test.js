require('@babel/register');
require('@babel/polyfill');

const { pick } = require('lodash');
const truffleAssert = require('truffle-assertions');
const { IpfsClient } = require('../src/utils');

const GalleryContract = artifacts.require('GalleryContract');

contract('GalleryContract', (accounts) => {
  const MAX_MEDIAS_BY_OWNER = 40;
  const ownerAddress = accounts[0];

  let contractInstance;

  beforeEach(async () => {
    contractInstance = await GalleryContract.new(ownerAddress);
  });

  it('should create contract with default max medias by owner', async () => {
    // given
    const deployedContract = await GalleryContract.deployed();

    // when
    const activatedContract = await deployedContract.getActivatedContract();
    const galleryOwnersCount = await deployedContract.getGalleryOwnersCount();
    const galleryMediasCount = await deployedContract.getGalleryMediasCount();
    const lastDateSavedMedia = await deployedContract.getLastDateSavedMedia();

    const maxMediasByOwner = await deployedContract.getMaxMediasByOwner();

    // then
    assert.equal(activatedContract, true);
    assert.equal(galleryOwnersCount.toNumber(), 0);
    assert.equal(galleryMediasCount.toNumber(), 0);
    assert.isNotNull(lastDateSavedMedia);

    assert.equal(maxMediasByOwner.toNumber(), MAX_MEDIAS_BY_OWNER);
  });

  it('should create contract with max medias by owner parameter', async () => {
    // given
    const expectedMaxMediasByOwner = 20;
    const instance = await GalleryContract.new(expectedMaxMediasByOwner, { from: ownerAddress });

    // when
    const maxMediasByOwner = await instance.getMaxMediasByOwner();

    // then
    assert.equal(maxMediasByOwner.toNumber(), expectedMaxMediasByOwner);
  });

  it('should emit event when toggle contract activation', async () => {
    // when
    const transaction = await contractInstance.toggleContractActivation({ from: ownerAddress });

    // then
    truffleAssert.eventEmitted(transaction, 'EventContractActivation', { contractActivation: false });
  });

  context('When save media', () => {
    const mediaToSave = {
      hash: IpfsClient.convertIpfsHashToHex(`Qm${'a'.repeat(44)}`),
      mediaType: 0, // image
      title: 'IPFS Image Test',
      tags: 'image,test',
    };

    it('should emit event when user save media', async () => {
      // given
      const {
        hash, mediaType, title, tags,
      } = mediaToSave;

      // when
      const transaction = await contractInstance.saveMedia(
        hash, mediaType, title, tags,
        { from: ownerAddress },
      );

      // then
      truffleAssert.eventEmitted(
        transaction,
        'EventSavedMedia', {
          hash,
          owner: ownerAddress,
          mediaType: web3.utils.toBN(mediaType),
          title,
          tags,
        },
      );
    });

    it('should retrieve media saved by hash', async () => {
      // given
      const {
        hash, mediaType, title, tags,
      } = mediaToSave;

      const expectedMedia = {
        hash,
        owner: ownerAddress,
        mediaType: web3.utils.toBN(mediaType),
        title,
        tags,
      };

      await contractInstance.saveMedia(
        hash, mediaType, title, tags,
        { from: ownerAddress },
      );

      // when
      const foundMedia = await contractInstance.getMediaByHash(hash);

      // then
      expect(pick(foundMedia, ['hash', 'owner', 'mediaType', 'title', 'tags']))
        .to.deep.equal(expectedMedia);
    });

    it('should retrieve medias saved by owner address', async () => {
      // given
      const expectedMedias = {
        owner: ownerAddress,
        hashes: [
          IpfsClient.convertIpfsHashToHex(`Qm${'a'.repeat(44)}`),
          IpfsClient.convertIpfsHashToHex(`Qm${'b'.repeat(44)}`),
        ],
      };

      const mediasToSave = [
        {
          hash: expectedMedias.hashes[0],
          owner: ownerAddress,
          mediaType: 0,
          title: 'IPFS Image 1',
          tags: 'test,img,media-n1',
        },
        {
          hash: expectedMedias.hashes[1],
          owner: ownerAddress,
          mediaType: 1,
          title: 'IPFS Video 1',
          tags: 'test,video,media-n2',
        },
      ];

      mediasToSave.forEach(async (media) => {
        const {
          hash, mediaType, title, tags,
        } = media;
        await contractInstance.saveMedia(
          hash, mediaType, title, tags,
          { from: ownerAddress },
        );
      });

      // when
      const foundMedias = await contractInstance.getHashesByAddress(ownerAddress);

      // then
      expect(pick(foundMedias, ['owner', 'hashes'])).to.deep.equal(expectedMedias);
    });

    it('should retrieve part of medias saved by owner address', async () => {
      // given
      const expectedMedias = {
        owner: ownerAddress,
        hashes: [
          IpfsClient.convertIpfsHashToHex(`Qm${'c'.repeat(44)}`),
          IpfsClient.convertIpfsHashToHex(`Qm${'d'.repeat(44)}`),
          IpfsClient.convertIpfsHashToHex(`Qm${'e'.repeat(44)}`),
        ],
        mediaTypes: [
          web3.utils.toBN(0),
          web3.utils.toBN(1),
          web3.utils.toBN(0),
        ],
      };

      const mediasToSave = [
        {
          hash: expectedMedias.hashes[0],
          owner: ownerAddress,
          mediaType: expectedMedias.mediaTypes[0].toNumber(),
          title: 'IPFS Image 1',
          tags: 'test,img,media-n1',
        },
        {
          hash: expectedMedias.hashes[1],
          owner: ownerAddress,
          mediaType: expectedMedias.mediaTypes[1].toNumber(),
          title: 'IPFS Video 1',
          tags: 'test,video,media-n2',
        },
        {
          hash: expectedMedias.hashes[2],
          owner: ownerAddress,
          mediaType: expectedMedias.mediaTypes[2].toNumber(),
          title: 'IPFS Video 1',
          tags: 'test,video,media-n2',
        },
      ];

      mediasToSave.forEach(async (media) => {
        const {
          hash, mediaType, title, tags,
        } = media;
        await contractInstance.saveMedia(
          hash, mediaType, title, tags,
          { from: ownerAddress },
        );
      });

      // when
      const foundMedias = await contractInstance.getPartOfMediasByAddress(ownerAddress);

      // then
      expect(pick(foundMedias, ['owner', 'hashes', 'mediaTypes'])).to.deep.equal(expectedMedias);
    });
  });
});
