import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './colors.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Config, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import FrameProvider from '@farcaster/frame-sdk';
import FarcasterConnector from '@farcaster/frame-wagmi-connector';
import account from './state/slices/account';
import auction from './state/slices/auction';
import block from './state/slices/block';
import noun from './state/slices/noun';
import vote from './state/slices/vote';
import settlement from './state/slices/settlement';
import mempool from './state/slices/mempool';
import auth from './state/slices/auth';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import dotenv from 'dotenv';
import { default as globalConfig } from './config';
import voteWebsocket from './middleware/voteWebsocket';
import ethersProviderMiddleware from './middleware/ethersProvider';
import alchemyWebsocketMiddleware from './middleware/alchemyWebsocket';


dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    auction,
    block,
    noun,
    settlement,
    vote,
    mempool,
    auth
  });

export default function configureStore(preloadedState: any) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
        alchemyWebsocketMiddleware,
        ethersProviderMiddleware,
        voteWebsocket
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Add type for the config
interface ExtendedConfig extends Config {
  connectors?: {
    farcaster: any;
  };
}

// Type assertion for FarcasterConnector
const farcasterConnector = FarcasterConnector as any;

const config: ExtendedConfig = {
  readOnlyChainId: globalConfig.chainId,
  readOnlyUrls: {
    [globalConfig.chainId]: globalConfig.jsonRpcUri
  },
  connectors: {
    farcaster: new farcasterConnector()
  }
};

// Cast FrameProvider to any to bypass type checking
const AnyFrameProvider = FrameProvider as any;

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <AnyFrameProvider>
        <Web3ReactProvider getLibrary={
          (provider, connector) => new Web3Provider(provider)
        }>
          <DAppProvider config={config}> 
            <App />
          </DAppProvider>
        </Web3ReactProvider>
      </AnyFrameProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
