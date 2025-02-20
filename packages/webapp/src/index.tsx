import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './colors.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Config, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import auction from './state/slices/auction';
import block from './state/slices/block';
import noun from './state/slices/noun';
import vote from './state/slices/vote';
import settlement from './state/slices/settlement';
import mempool from './state/slices/mempool';
import auth from './state/slices/auth';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { default as globalConfig } from './config';
import voteWebsocket from './middleware/voteWebsocket';
import ethersProviderMiddleware from './middleware/ethersProvider';
import alchemyWebsocketMiddleware from './middleware/alchemyWebsocket';

// Create React App handles env variables automatically, no need for dotenv in browser
export const history = createBrowserHistory();

const store = configureStore({
  reducer: {
    account,
    auction,
    block,
    noun,
    settlement,
    vote,
    mempool,
    auth
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      alchemyWebsocketMiddleware,
      ethersProviderMiddleware,
      voteWebsocket
    ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const config: Config = {
  readOnlyChainId: globalConfig.chainId,
  readOnlyUrls: {
    [globalConfig.chainId]: globalConfig.jsonRpcUri
  }
};

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Web3ReactProvider getLibrary={
          (provider, connector) => new Web3Provider(provider)
        }>
          <DAppProvider config={config}> 
            <App />
          </DAppProvider>
        </Web3ReactProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
