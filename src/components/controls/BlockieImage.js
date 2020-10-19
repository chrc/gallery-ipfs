import React, { useEffect, useState } from 'react';

import { ListItemIcon, makeStyles } from '@material-ui/core';
import makeBlockie from 'ethereum-blockies-base64';

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    padding: '12px 0px',
  },
  image: {
    width: 25,
  },
  address: {
    fontSize: '0.7rem',
    color: 'white',
    paddingLeft: 10,
  },
});

export default function BlockieImage({ address }) {
  const [seed, setSeed] = useState('0x0');
  const classes = useStyles();

  useEffect(() => {
    const load = () => {
      setSeed(address);
    };
    if (typeof address !== 'undefined') {
      load();
    }
  }, [address]);

  return (
    <ListItemIcon className={classes.root}>
      <img src={makeBlockie(seed)} alt="blockie" className={classes.image} />
      <span className={classes.address}>{seed.toLowerCase()}</span>
    </ListItemIcon>
  );
}
