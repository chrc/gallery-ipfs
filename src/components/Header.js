import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  AppBar, Grid, InputBase, Toolbar,
  fade, makeStyles,
} from '@material-ui/core';

import { Home as HomeIcon, Search as SearchIcon } from '@material-ui/icons';
import { useSnackbar } from 'notistack';

import Controls from './controls/Controls';
import { SearchUtils } from '../utils';
import BlockchainContext from '../context';

const useStyles = makeStyles((theme) => ({
  root: {
    listStyle: 'none',
    flexGrow: 1,
    width: '100%',
  },
  icon: {
    marginTop: 5,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    margin: '10px 0px 10px -20px',
    width: '430px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: `calc(1em + ${theme.spacing(2.5)}px)`,
    transition: theme.transitions.create('width'),
    fontSize: '.8em',
    '::-webkit-input-placeholder': {
      color: 'red',
    },
    width: '400px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  all: {
    padding: '8px 0px 0px 60px',
  },
}));

function Header() {
  const [address, setAddress] = useState('0x0');
  const { accounts } = useContext(BlockchainContext);

  const history = useHistory();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const load = () => {
      setAddress(accounts[0]);
    };
    if (typeof accounts !== 'undefined') {
      load();
    }
  }, [accounts]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.value) {
      const {
        errorMessage, pathname, searchData,
      } = SearchUtils.getPathnameToUse(event.target.value);

      if (errorMessage) {
        enqueueSnackbar(errorMessage, {
          variant: 'warning',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      } else {
        history.push({ pathname, state: { searchData } });
        event.target.value = '';
      }
    }
  };

  function SearchItem() {
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          name="searchValue"
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onKeyDown={handleKeyDown}
        />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Grid container className={classes.root} spacing={2}>

            <Grid className={classes.icon}>
              <Controls.ListItemLink
                to="/"
                icon={<HomeIcon style={{ color: 'white' }} fontSize="large" />}
              />
            </Grid>

            <Grid item xs={3}>
              <SearchItem />
            </Grid>

            <Grid className={classes.all}>
              <Controls.ListItemLink to="/mymedias" primary="All my medias" />
            </Grid>

            <Grid item xs={2}>
              <Controls.ListItemLink to="/addmedia" primary="Add my media" />
            </Grid>

            <Grid item xs={1}>
              <Controls.ListItemLink to="/about" primary="About" />
            </Grid>
            <Grid item xs={1}>
              <Controls.BlockieImage address={address} />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
