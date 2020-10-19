require('dotenv').config();

const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { INFURA_PROJECT_ID, PRIVATE_KEY } = process.env;

const INFURA_URL_ROPSTEN = `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`;

module.exports = {
  contracts_build_directory: path.join(__dirname, 'src/contracts'),

  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
    ropsten: {
      provider: () => new HDWalletProvider({
        privateKeys: [PRIVATE_KEY],
        providerOrUrl: INFURA_URL_ROPSTEN,
      }),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.6.0', // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};
