import React, { useContext, useEffect, useState } from 'react';

import {
  Card, CardContent, Divider,
  List, Typography,
  makeStyles,
} from '@material-ui/core';

import Controls from './controls/Controls';

import BlockchainContext from '../context';
import { IpfsClient } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    height: 600,
    margin: '80px auto',
    maxWidth: 900,
  },
  notFound: {
    padding: '100px 0px',
    color: 'red',
    fontStyle: 'italic',
  },
  found: {
    padding: '30px 30px',
    height: 550,
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    paddingLeft: 20,
    maxHeight: 450,
  },
}));

const initiatedData = {
  ownerAddress: null,
  hashes: [],
};

function SearchMediaByAddress({ location }) {
  const { searchData } = location.state;
  const { contracts } = useContext(BlockchainContext);

  const [ownerHashes, setOwnerHashes] = useState(initiatedData);

  const classes = useStyles();

  useEffect(() => {
    const load = async () => {
      const { GalleryContract } = contracts;
      const foundData = await GalleryContract.methods.getHashesByAddress(searchData.toLowerCase()).call();
      const tempOwnerHashes = IpfsClient.transformToOwnerHashes(foundData);

      setOwnerHashes(tempOwnerHashes);
    };

    if (typeof contracts !== 'undefined'
      && typeof web3 !== 'undefined') {
      load();
    }
  }, [searchData]);

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        align="center"
        paragraph
        color="primary"
      >
        Searching for Owner&apos;s media hashes
      </Typography>

      {!ownerHashes.ownerAddress
        ? (
          <Card>
            <Typography
              variant="h3"
              className={classes.notFound}
              align="center"
              paragraph
              color="primary"
            >
              NOT FOUND!
            </Typography>
          </Card>
        )
        : (
          <Card className={classes.found}>
            <Typography variant="h6" color="textSecondary" component="p">
              {ownerHashes.hashes.length}
              {' '}
              IPFS medias saved by&nbsp;
              {ownerHashes.ownerAddress}
            </Typography>

            <Divider />

            <CardContent>
              <List
                className={classes.list}
                component="nav"
                aria-label="hashes"
              >
                {ownerHashes.hashes.map((hash) => (
                  <Controls.ListItemLink
                    key={hash}
                    to={`/searchmediabyhash?hash=${hash}`}
                    primary={hash}
                  />
                ))}
              </List>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

export default SearchMediaByAddress;
