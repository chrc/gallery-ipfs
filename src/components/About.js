import React, { useContext, useState, useEffect } from 'react';

import {
  Grid, Paper, Typography, makeStyles,
} from '@material-ui/core';
import Timestamp from 'react-timestamp';

import BlockchainContext from '../context';
import { IpfsClient } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
    margin: '80px auto',
    fontSize: '1.5em',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    '& span': {
      color: 'white',
      padding: '0px 10px',
    },
  },
  ON: {
    background: 'green',
  },
  'N/A': {
    background: 'red',
  },
  OFF: {
    background: 'red',
  },
  contractAddress: {
    margin: 0,
  },
  grid: {
    maxWidth: 800,
    width: '100%',
    margin: '-12px auto',
    justifyContent: 'center',
  },
  row: {
    paddingTop: 12,
  },
  paperName: {
    padding: theme.spacing(4),
    marginRight: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    color: theme.palette.text.secondary,
  },
  paperValue: {
    padding: theme.spacing(4),
    marginLeft: 10,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function About() {
  const [contractStatus, setContractStatus] = useState('N/A');
  const [contractAddress, setContractAddress] = useState('');

  const [galleryOwnersCount, setGalleryOwnersCount] = useState(0);
  const [galleryMediasCount, setGalleryMediasCount] = useState(0);
  const [lastDateSavedMedia, setLastDateSavedMedia] = useState(null);
  const [maxMediasByOwner, setMaxMediasByOwner] = useState(null);

  const { contracts } = useContext(BlockchainContext);

  const classes = useStyles();

  const xsForName = 6;
  const xsForValue = 6;

  useEffect(() => {
    const load = async () => {
      const { GalleryContract } = contracts;

      try {
        setContractAddress(GalleryContract.options.address);

        const isActiveContract = await GalleryContract.methods.getActivatedContract.call();
        const tempGalleryOwnersCount = await GalleryContract.methods.getGalleryOwnersCount().call();
        const tempGalleryMediasCount = await GalleryContract.methods.getGalleryMediasCount().call();
        const tempLastDateSavedMedia = await GalleryContract.methods.getLastDateSavedMedia().call();
        const tempMaxMediasByOwner = await GalleryContract.methods.getMaxMediasByOwner().call();

        setContractStatus(isActiveContract ? 'ON' : 'OFF');
        setGalleryOwnersCount(tempGalleryOwnersCount);
        setGalleryMediasCount(tempGalleryMediasCount);
        setLastDateSavedMedia(tempLastDateSavedMedia);
        setMaxMediasByOwner(tempMaxMediasByOwner);
      } catch (error) {
        console.error(error);
      }
    };

    if (typeof contracts !== 'undefined') {
      load();
    }
  }, [contracts]);

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Typography
          variant="h4"
          align="center"
          color="primary"
        >
          DApp informations
        </Typography>
        <div>
          <Typography
            className={classes.title}
            variant="h4"
            align="center"
            color="primary"
          >
            Contract status:&nbsp;
            <span className={classes[contractStatus]}>{contractStatus}</span>
          </Typography>
          <h6 className={classes.contractAddress}>{contractAddress}</h6>
        </div>
      </div>

      <Grid container spacing={3} className={classes.grid}>
        <Grid container xs={12} className={classes.row}>
          <Grid xs={xsForName}>
            <Paper className={classes.paperName}>IPFS Gateway</Paper>
          </Grid>
          <Grid xs={xsForValue}>
            <Paper className={classes.paperValue}>{IpfsClient.getIpfsGateway()}</Paper>
          </Grid>
        </Grid>

        <Grid container xs={12} className={classes.row}>
          <Grid xs={xsForName}>
            <Paper className={classes.paperName}>Number of users</Paper>
          </Grid>
          <Grid xs={xsForValue}>
            <Paper className={classes.paperValue}>{galleryOwnersCount}</Paper>
          </Grid>
        </Grid>

        <Grid container xs={12} className={classes.row}>
          <Grid xs={xsForName}>
            <Paper className={classes.paperName}>Number of medias uploaded</Paper>
          </Grid>
          <Grid xs={xsForValue}>
            <Paper className={classes.paperValue}>{galleryMediasCount}</Paper>
          </Grid>
        </Grid>

        <Grid container xs={12} className={classes.row}>
          <Grid xs={xsForName}>
            <Paper className={classes.paperName}>Last upload</Paper>
          </Grid>
          <Grid xs={xsForValue}>
            <Paper className={classes.paperValue}>
              {
                lastDateSavedMedia > 0
                  ? <Timestamp date={lastDateSavedMedia} />
                  : <div>&nbsp;</div>
              }
            </Paper>
          </Grid>
        </Grid>

        <Grid container xs={12} className={classes.row}>
          <Grid xs={xsForName}>
            <Paper className={classes.paperName}>Maximum medias per user</Paper>
          </Grid>
          <Grid xs={xsForValue}>
            <Paper className={classes.paperValue}>{maxMediasByOwner}</Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default About;
