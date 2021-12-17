import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Config, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application from './state/slices/application';
import auction from './state/slices/auction';
import background from './state/slices/background';
import block from './state/slices/block';
import connections from './state/slices/connections';
import noun from './state/slices/noun';
import vote from './state/slices/vote';
import score from './state/slices/score';
import settle from './state/slices/settle';
import websocket from './state/slices/websocket';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import dotenv from 'dotenv';
import { default as globalConfig } from './config';
import voteWebsocket from './middleware/voteWebsocket';

dotenv.config();

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    background,
    block,
    connections,
    noun,
    score,
    settle,
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
        voteWebsocket
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
const config: Config = {
  readOnlyChainId: globalConfig.chainId,
  readOnlyUrls: {
    [globalConfig.chainId]: globalConfig.jsonRpcUri
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
