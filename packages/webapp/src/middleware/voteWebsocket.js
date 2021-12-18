import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { FOMO_WEBSOCKET } from '../config';

import {
  setConnected,
  setNumConnections,
  setScore,
  incrementCount,
  triggerSettlement
} from '../state/slices/vote';


// Define the Actions Intercepted by the Middleware
const openVoteSocket = (payload) => ({type: 'voteSocket/open', payload});
const closeVoteSocket = (payload) => ({type: 'voteSocket/close', payload});
const sendVote = (payload) => ({type: 'voteSocket/send', payload});


// Define the Middleware
const voteWebsocketMiddleware = () => {
  let socket = null;

  const openSocket = () => new W3CWebSocket(FOMO_WEBSOCKET);
  const closeSocket = () => { if (socket !== null) socket.close() };

  // Define the Handler Methods
  const handleOpen = store => () => {
    console.log('FOMO Web Socket OPEN.');
    store.dispatch(setConnected(true));
  }
  
  const handleReceiveMessage = store => (msg) => {
    try {
      const data = JSON.parse(String(msg.data));
      console.log(data);
      if (data.vote) {
        store.dispatch(incrementCount(data.vote));
      }
      if ('score' in data) {
        store.dispatch(setScore(data.score));
      }
      if (data.settlementAttempted) {
        store.dispatch(triggerSettlement());
      }
      if('connections' in data) {
        store.dispatch(setNumConnections(data.connections));
      }
    } catch(err) {
      console.error('Erroring parsing FOMO websocket message');
      console.error(err);
    }
  }

  const handleSendMessage = (msg) => {
    try {
      const { nounId, blockhash, vote } = msg;
      const voteMsg = {"action": "sendvote", "nounId": nounId, "blockhash": blockhash, "vote": vote};
      socket.send(JSON.stringify(voteMsg));
    } catch(e) {
      console.error('Websocket message ill-formed');
      console.log(e);
    }
  }
  
  const handleClose = store => () => {
    console.log('FOMO Web Socket CLOSED.');
    store.dispatch(setConnected(false));
  }


  // Define the Middleware
  return store => next => action => {
    if (action.type === 'voteSocket/open') {
      closeSocket();
      socket = openSocket();
      socket.onopen = handleOpen(store);
      socket.onmessage = handleReceiveMessage(store);
      socket.onclose = handleClose(store);
    }
    else if (action.type === 'voteSocket/close') {
      closeSocket();
    }
    else if (action.type === 'voteSocket/send') {
      handleSendMessage(action.payload);
    }
    else {
      return next(action);
    }
  };
};


export default voteWebsocketMiddleware();
export { openVoteSocket, closeVoteSocket, sendVote };