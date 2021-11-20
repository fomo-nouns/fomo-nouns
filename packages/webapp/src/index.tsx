import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, Config, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application from './state/slices/application';
import background from './state/slices/background';
import block from './state/slices/block';
import noun from './state/slices/noun';
import vote from './state/slices/vote';
import websocket from './state/slices/websocket';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import dotenv from 'dotenv';

dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    background,
    block,
    noun,
    vote,
    websocket,
  });

export default function configureStore(preloadedState: any) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
console.log(process.env.REACT_APP_MAINNET_JSONRPC);
const config: Config = {
  readOnlyChainId: ChainId.Mainnet,
  readOnlyUrls: {
    [ChainId.Mainnet]: process.env.REACT_APP_MAINNET_JSONRPC || `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID}`
  }
};

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Web3ReactProvider getLibrary={
        (provider, connector) => new Web3Provider(provider)
      }>
        <DAppProvider config={config}> 
          <App />
        </DAppProvider>
      </Web3ReactProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
