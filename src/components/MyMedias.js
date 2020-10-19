import React, { useContext, useEffect, useState } from 'react';

import {
  Card,
  Grid, GridList, GridListTile, GridListTileBar,
  IconButton, Paper,
  Tooltip, Typography,
  makeStyles,
} from '@material-ui/core';
import { Info as InfoIcon } from '@material-ui/icons';
import ReactPlayer from 'react-player/lazy';

import BlockchainContext from '../context';

import { IpfsClient } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 900,
    width: '100%',
    maxHeight: 750,
    margin: '80px auto',
  },
  notFound: {
    padding: '100px 0px',
    color: 'red',
    fontStyle: 'italic',
  },
  paper: {
    paddingLeft: 20,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  count: {
    padding: '20px auto',
    color: theme.palette.text.secondary,
  },
  gridItem: {
    paddingRight: '0 !important',
  },
  gridList: {
    width: '100%',
    height: 750,
    transform: 'translateZ(0)',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

function MyMedias({ history }) {
  const [medias, setMedias] = useState(IpfsClient.initiatedPartOfData);

  const { accounts, contracts } = useContext(BlockchainContext);
  const classes = useStyles();

  useEffect(() => {
    const load = async () => {
      const { GalleryContract } = contracts;
      const address = accounts[0];
      try {
        const foundData = await GalleryContract.methods.getPartOfMediasByAddress(address).call();

        const foundMedias = IpfsClient.transformPartOfMedias(foundData);
        setMedias(foundMedias);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (typeof accounts !== 'undefined'
      && typeof contracts !== 'undefined') {
      load();
    }
  }, [accounts, contracts]);

  const showDetails = (media) => {
    history.push({
      pathname: '/searchmediabyhash',
      state: { searchData: media.hash },
    });
  };

  return (
    <div className={classes.root}>
      <Typography
        variant="h4"
        align="center"
        paragraph
        color="primary"
      >
        All my medias
      </Typography>

      {!medias.count
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
          <Paper className={classes.paper}>
            <h2 className={classes.count}>
              {medias.count}
              {' '}
              IPFS medias saved by&nbsp;
              {medias.ownerAddress}
            </h2>

            <Grid container spacing={3}>
              <Grid container item xs={5} spacing={2} className={classes.gridItem}>
                <GridList className={classes.gridList} spacing={1} cellHeight={200}>
                  {medias.images.map((image, index) => (
                    <GridListTile key={image.hash} cols={1} rows={1}>
                      <img src={image.source} alt={image.hash} />
                      ,
                      <GridListTileBar
                        title={`Image N°${index + 1}`}
                        subtitle={<span>{image.hash}</span>}
                        titlePosition="top"
                        actionIcon={(
                          <Tooltip title="Show details">
                            <IconButton
                              aria-label={`star ${image.hash}`}
                              className={classes.icon}
                              onClick={() => showDetails(image)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        actionPosition="left"
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Grid>

              <Grid container item xs={7} className={classes.gridItem}>
                <GridList className={classes.gridList} spacing={1} cellHeight={200}>
                  {medias.videos.map((video, index) => (
                    <GridListTile key={video.source} cols={1} rows={1}>
                      <ReactPlayer
                        width={263}
                        height="100%"
                        url={video.source}
                        playing={false}
                        controls
                      />
                      <GridListTileBar
                        title={`Video N°${index + 1}`}
                        subtitle={<span>{video.hash}</span>}
                        titlePosition="top"
                        actionIcon={(
                          <Tooltip title="Show details">
                            <IconButton
                              aria-label={`star ${video.hash}`}
                              className={classes.icon}
                              onClick={() => showDetails(video)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        actionPosition="left"
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Grid>
            </Grid>
          </Paper>
        )}
    </div>
  );
}

export default MyMedias;
