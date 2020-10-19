import React from 'react';

import { makeStyles } from '@material-ui/core';

const backgroundHomeImage = '/picture2.jpg';
const backgroundHomeImageMobile = '/picture2_mobile.png';

const useStyles = makeStyles((theme) => ({
  root: {
    //margin: 0,
  },
  imageHome: {
    backgroundImage: `url(${backgroundHomeImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: -1,

    [theme.breakpoints.down('xs')]: {
      backgroundImage: `url(${backgroundHomeImageMobile})`,
    },
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <section className={classes.imageHome} />
    </div>
  );
}

export default Home;
