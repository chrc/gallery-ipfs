import React from 'react';
import { render } from 'react-dom';

import 'normalize.css';

import App from './App';
import './index.css';

import * as serviceWorker from './serviceWorker';

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.unregister();
