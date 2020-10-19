import React from 'react';

import {
  Card, CardActionArea, CardActions,
  CardContent, CardMedia,
  Button, Typography,
  makeStyles,
} from '@material-ui/core';

import ReactPlayer from 'react-player/lazy';

const useStyles = makeStyles({
  root: {
    height: 700,
    margin: '80px auto',
    maxWidth: 900,
  },
  media: {
    height: 450,
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
  },
});

function MediaDetails(props) {
  const location = props;
  const { media } = location.state;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card>
        <CardActionArea>
          {
            {
              image: <CardMedia
                className={classes.media}
                image={media.source}
                title={media.name}
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
            <Typography gutterBottom variant="h5" component="h2">
              {media.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
          </Button>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default MediaDetails;
