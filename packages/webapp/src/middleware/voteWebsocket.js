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
const openVoteSocket = (payload) => ({ type: 'voteSocket/open', payload });
const closeVoteSocket = (payload) => ({ type: 'voteSocket/close', payload });
const sendVote = (payload) => ({ type: 'voteSocket/send', payload });
const markVoterInactive = (payload) => ({ type: 'voteSocket/inactive', payload });
const sendCaptchaToken = (payload) => ({ type: 'voteSocket/captcha', payload });


// Define the Middleware
const voteWebsocketMiddleware = () => {
  let socket = null;

  const createSocket = () => new W3CWebSocket(FOMO_WEBSOCKET);

  // Define the socket handlers
  const openSocket = (store) => {
    socket = createSocket();
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
      if ('connections' in data) {
        store.dispatch(setNumConnections(data.connections));
      }
      if ('activeVoters' in data) {
        store.dispatch(setActiveVoters(data.activeVoters));
      }
    } catch (err) {
      console.error('Erroring parsing FOMO websocket message');
      console.error(err);
    }
  }

  const handleSendMessage = (msg) => {
    try {
      const { nounId, blockhash, vote } = msg;
      const voteMsg = { "action": "sendvote", "nounId": nounId, "blockhash": blockhash, "vote": vote };
      socket.send(JSON.stringify(voteMsg));
    } catch (e) {
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
      const statusMsg = { "action": "changestatus", "status": "inactive" };
      socket.send(JSON.stringify(statusMsg));
    } catch (e) {
      console.error('Websocket message ill-formed');
      console.log(e);
    }
  }

  const handleCaptchaToken = (msg) => {
    try {
      const { token } = msg;
      const tokenMsg = { "action": "checkcaptcha", "token": token };
      socket.send(JSON.stringify(tokenMsg));
    } catch (e) {
      console.error('Websocket "checkcaptcha" message ill-formed');
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
    else if (action.type === 'voteSocket/captcha') {
      handleCaptchaToken(action.payload);
    }
    else {
      return next(action);
    }
  };
};


export default voteWebsocketMiddleware();
export { openVoteSocket, closeVoteSocket, sendVote, markVoterInactive, sendCaptchaToken };