import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { FOMO_WEBSOCKET } from '../config';
import { setAttemptedSettleBlockHash } from '../state/slices/settlement';
import {
  setConnected,
  setNumConnections,
  setScore,
  incrementCount,
  triggerSettlement,
  setActiveVoters
} from '../state/slices/vote';


// Define the Actions Intercepted by the Middleware
const openVoteSocket = (payload) => ({type: 'voteSocket/open', payload});
const closeVoteSocket = (payload) => ({type: 'voteSocket/close', payload});
const sendVote = (payload) => ({type: 'voteSocket/send', payload});
const markVoterInactive = (payload) => ({type: 'voteSocket/inactive', payload});


// Define the Middleware
const voteWebsocketMiddleware = () => {
  let socket = null;

  const createSocket = (signature, address, nounId) => {
    // Pass auth data in query parameters for API Gateway compatibility
    const authParams = new URLSearchParams({
      signature,
      address: address.toLowerCase(),
      nounId
    });
    const socket = new W3CWebSocket(`${FOMO_WEBSOCKET}?${authParams.toString()}`);
    return socket;
  };

  // Define the socket handlers
  const openSocket = (store) => {
    const state = store.getState();
    const { signature, address } = state.auth;
    const nextNounId = state.noun.nextNounId?.toString();

    // Only open socket if we have auth data
    if (!signature || !address || !nextNounId) {
      console.error('Missing auth data for websocket connection');
      return;
    }

    socket = createSocket(signature, address, nextNounId);
    socket.onopen = handleOpen(store);
    socket.onmessage = handleReceiveMessage(store);
    socket.onclose = handleClose(store);
  }

  const closeSocket = () => { if (socket !== null) socket.close() };

  // Define the Handler Methods
  const handleOpen = store => () => {
    console.log('FOMO Web Socket OPEN.');
    store.dispatch(setConnected(true));
  }
  
  const handleReceiveMessage = store => (msg) => {
    try {
      const data = JSON.parse(String(msg.data));
      if (data.vote) {
        store.dispatch(incrementCount(data.vote));
      }
      if ('score' in data) {
        store.dispatch(setScore(data.score));
      }
      if (data.settlementAttempted) {
        store.dispatch(triggerSettlement());
        store.dispatch(setAttemptedSettleBlockHash(data.blockhash));
      }
      if('connections' in data) {
        store.dispatch(setNumConnections(data.connections));
      }
      if ('activeVoters' in data) {
        store.dispatch(setActiveVoters(data.activeVoters));
      }
      if (data.error === 'invalid_signature' || data.error === 'missing_fields') {
        console.error('Authentication error:', data.message);
        closeSocket();
      }
    } catch(err) {
      console.error('Error parsing FOMO websocket message');
      console.error(err);
    }
  }

  const handleSendMessage = (msg) => {
    try {
      const { nounId, blockhash, vote } = msg;
      const voteMsg = { action: "sendvote", nounId, blockhash, vote };
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

  const handleInactiveStatus = () => {
    try {
      if (socket && socket.readyState === socket.OPEN) {
        const statusMsg = {"action": "changestatus", "status": "inactive"};
        socket.send(JSON.stringify(statusMsg));
      }
    } catch(e) {
      console.error('Websocket message ill-formed');
      console.log(e);
    }
  }


  // Define the Middleware
  return store => next => action => {
    if (action.type === 'voteSocket/open') {
      closeSocket();
      openSocket(store);
    }
    else if (action.type === 'voteSocket/close') {
      closeSocket();
    }
    else if (action.type === 'voteSocket/send') {
      handleSendMessage(action.payload);
    }
    else if (action.type === 'voteSocket/inactive') {
      handleInactiveStatus();
    }
    else {
      return next(action);
    }
  };
};


export default voteWebsocketMiddleware();
export { openVoteSocket, closeVoteSocket, sendVote, markVoterInactive };