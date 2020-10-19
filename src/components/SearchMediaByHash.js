import React, { useContext, useEffect, useState } from 'react';

import {
  Card,
  CardContent, CardMedia,
  Chip, Typography,
  makeStyles,
} from '@material-ui/core';

import ReactPlayer from 'react-player/lazy';
import Timestamp from 'react-timestamp';
import QueryString from 'query-string';

import BlockchainContext from '../context';
import { IpfsClient } from '../utils';

const useStyles = makeStyles({
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
  media: {
    height: 450,
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
  },
  chip: {
    marginLeft: 5,
  },
});

const initiatedMedia = {
  hash: null,
  owner: null,
  title: null,
  tags: [],
  createdAt: null,
  type: null,
  source: '',
};

function SearchMediaByHash({ location }) {
  const { contracts } = useContext(BlockchainContext);
  const [media, setMedia] = useState(initiatedMedia);

  const classes = useStyles();

  let searchData = null;

  if (location.state && location.state.searchData) {
    searchData = location.state.searchData;
  } else if (location.search) {
    searchData = QueryString.parse(location.search).hash;
  }

  useEffect(() => {
    const load = async () => {
      const hex = IpfsClient.convertIpfsHashToHex(searchData);

      const { GalleryContract } = contracts;
      const foundMedia = await GalleryContract.methods.getMediaByHash(hex).call();
      const tempMedia = IpfsClient.transformToMedia(foundMedia);

      setMedia(tempMedia);
    };

    if (typeof contracts !== 'undefined') {
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
        Searching for Media
      </Typography>

      {!media.hash
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
          <Card>
            <CardContent>
              {
                {
                  image: <CardMedia
                    className={classes.media}
                    image={media.source}
                    title={media.title}
                  />,
                  video: <ReactPlayer
                    width="100%"
                    height="100%"
                    url={media.source}
                    playing={false}
                    controls
                  />,
                }[media.type]
              }

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2" color="textSecondary">
                  {media.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Saved by:
                  {' '}
                  {media.owner}
                  , the
                  {' '}
                  <Timestamp date={media.createdAt} />
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  IPFS Hash:
                  {' '}
                  {media.hash}
                </Typography>
              </CardContent>
            </CardContent>

            <CardContent>
              {media.tags.map((tag) => (
                <Chip
                  className={classes.chip}
                  key={tag}
                  size="small"
                  label={tag}
                />
              ))}
            </CardContent>
          </Card>
        )}
    </div>
  );
}

export default SearchMediaByHash;
