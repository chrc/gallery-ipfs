import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { SnackbarProvider } from 'notistack';
import {
  makeStyles, CssBaseline, createMuiTheme, ThemeProvider,
} from '@material-ui/core';

import themeOptions from './theme';

import { BlockchainUtils } from './utils';
import BlockchainContext from './context';

import {
  About,
  AddMedia,
  Header,
  Home,
  MyMedias,
  NoMatchPage,
  SearchMediaByHash, SearchMediaByAddress,
} from './components';

const theme = createMuiTheme(themeOptions);

const useStyles = makeStyles({
  appMain: {
    width: '100%',
  },
});

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contracts, setContracts] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      try {
        const tempWeb3 = await BlockchainUtils.getWeb3();
        const tempAccounts = await BlockchainUtils.getAccounts(tempWeb3);
        const tempContracts = await BlockchainUtils.getContracts(tempWeb3);

        setWeb3(tempWeb3);
        setAccounts(tempAccounts);
        setContracts(tempContracts);
      } catch (error) {
        console.error('Failed to load web3, accounts, or contract!\n', error);
      }
    };

    init();
  }, []);

  const classes = useStyles();

  return (
    <BlockchainContext.Provider value={{ web3, accounts, contracts }}>

      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={5} preventDuplicate>
          <Router>
            <div className={classes.appMain}>
              <Header />
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/about" component={About} />
                <Route path="/addmedia" component={AddMedia} />
                <Route path="/mymedias" component={MyMedias} />
                <Route path="/searchmediabyhash" exact component={SearchMediaByHash} />
                <Route path="/searchmediabyaddress" exact component={SearchMediaByAddress} />
                <Route component={NoMatchPage} />
              </Switch>
            </div>
          </Router>
          <CssBaseline />
        </SnackbarProvider>
      </ThemeProvider>

    </BlockchainContext.Provider>
  );
}

export default App;
