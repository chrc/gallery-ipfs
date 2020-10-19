import web3 from 'web3';

const getPathnameToUse = (value) => {
  const IPFS_HASH_LENGTH = 46;
  const ETHEREUM_ADDRESS_LENGTH = 42;
  const SEARCH_PATHNAME_BY_HASH = '/searchmediabyhash';
  const SEARCH_PATHNAME_BY_ADDRESS = '/searchmediabyaddress';

  const result = {
    searchData: null,
    pathname: null,
    errorMessage: null,
  };

  const data = value.trim();
  result.searchData = data;

  switch (data.length) {
    case IPFS_HASH_LENGTH:
      result.pathname = SEARCH_PATHNAME_BY_HASH;
      break;

    case ETHEREUM_ADDRESS_LENGTH:
      if (data.startsWith('0x')
      && web3.utils.isAddress(data)) {
        result.pathname = SEARCH_PATHNAME_BY_ADDRESS;
        break;
      }

    default:
      result.errorMessage = 'Use IPFS hash (46 characters length)\n'
        + 'or Ethereum address (start by 0x)';
  }

  return result;
};

const SearchUtils = {
  getPathnameToUse,
};

export default SearchUtils;
