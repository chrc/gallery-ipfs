import React from 'react';
import { Button } from '@material-ui/core';

import DayJS from 'dayjs';
import Web3 from 'web3';

import IpfsClient from './IpfsClient';
import GalleryContract from '../contracts/GalleryContract.json';

const {
  REACT_APP_GAS_PRICE,
  REACT_APP_MAX_GAS,
} = process.env;

const getAccounts = (_web3) => _web3.eth.getAccounts();

const getContracts = async (_web3) => {
  const networkId = await _web3.eth.net.getId();

  const deployedNetwork = GalleryContract.networks[networkId];
  const galleryInstance = new _web3.eth.Contract(
    GalleryContract.abi,
    deployedNetwork && deployedNetwork.address,
  );

  return {
    GalleryContract: galleryInstance,
  };
};

const getWeb3 = () => new Promise((resolve, reject) => {
  window.addEventListener('load', async () => {
    if (window.ethereum) {
      // Modern dapp browsers...
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', () => window.location.reload());
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    } else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const { web3 } = window;
      console.log('Injected web3 detected.');
      resolve(web3);
    } else {
      // Fallback to localhost; use dev console port by default...
      const provider = new Web3.providers.HttpProvider(
        'http://127.0.0.1:8545',
      );
      const web3 = new Web3(provider);
      console.log('No web3 instance injected, using Local web3.');
      resolve(web3);
    }
  });
});

const saveMediaIntoBlockchain = ({
  contracts, accounts, hash, values,
  closeSnackbar, enqueueSnackbar,
}) => {
  const action = (key) => (
    <>
      <Button onClick={() => { closeSnackbar(key); }}>
        GOT IT
      </Button>
    </>
  );

  const { GalleryContract } = contracts;

  GalleryContract.methods.saveMedia(
    IpfsClient.convertIpfsHashToHex(hash),
    values.fileType === 'image' ? 0 : 1,
    values.mediaName,
    values.mediaTags,
  ).send({
    from: accounts[0],
    gasPrice: REACT_APP_GAS_PRICE,
    gas: REACT_APP_MAX_GAS,
  })
    .on('transactionHash', (hash) => {
      enqueueSnackbar(`transactionHash: ${hash}`, { variant: 'info' });
    })
    .on('receipt', (receipt) => {
      const { gasUsed, events } = receipt;
      const { EventSavedMedia } = events;

      let { createdAt, hash } = EventSavedMedia.returnValues;
      hash = IpfsClient.convertHexToIpfsHash(hash);
      createdAt = DayJS.unix(createdAt).format('DD MMM YYYY, HH:mm');

      const message = `Media saved in IPFS: ${hash}, the ${createdAt}, with ${gasUsed} gas used.`;
      enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 5000,
        action,
      });
    })
    .on('error', (error) => {
      enqueueSnackbar(error.message, { variant: 'error' });
    });
};

const BlockchainUtils = {
  getAccounts,
  getContracts,
  getWeb3,
  saveMediaIntoBlockchain,
};

export default BlockchainUtils;
