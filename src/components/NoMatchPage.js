import React from 'react';

import { makeStyles } from '@material-ui/core';

const backgroundHomeImage = '/not-found.jpg';

const useStyles = makeStyles({
  root: {
    margin: 0,
  },
  imageHome: {
    backgroundImage: `url(${backgroundHomeImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,
  },
});

function NoMatchPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <section className={classes.imageHome} />
    </div>
  );
}

export default NoMatchPage;
