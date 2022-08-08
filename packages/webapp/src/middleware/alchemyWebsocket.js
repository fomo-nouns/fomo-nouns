import { default as globalConfig, PROVIDER_KEY } from '../config';

import { setEthereumConnected, setBlockAttr } from '../state/slices/block';
import { resetVotes } from '../state/slices/vote';
import { resetAuctionEnd } from '../state/slices/auction';

import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { checkAuctionAndSettlement } from './ethersProvider';
import dayjs from 'dayjs';

// Define the Actions Intercepted by the Middleware
const openEthereumSocket = (payload) => ({type: 'ethereumSocket/open', payload});
const closeEthereumSocket = (payload) => ({type: 'ethereumSocket/close', payload});


// Define the Middleware
const alchemyWebsocketMiddleware = () => {
  let socket = null;
  let blockSubscription = '0x';
  let blockId = 44;
  let latestObservedBlock = 0;

  const openSocket = () => new W3CWebSocket(`wss://eth-${globalConfig.chainName}.alchemyapi.io/v2/${PROVIDER_KEY}`);
  const closeSocket = () => { if (socket !== null) socket.close() };

  // Websocket Parsing & Sending Message
  const parseMessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (data?.params?.subscription === blockSubscription) {
        return data.params.result;
      } else if (data.id === blockId) {
        blockSubscription = data.result;
      }
    } catch(e) {
      console.log('Error parsing Alchemy websocket message');
      console.log(e);
    }
  }

  const newBlockSubscriptionRequest = JSON.stringify({
    "jsonrpc":"2.0",
    "id": blockId,
    "method": "eth_subscribe",
    "params": ["newHeads"]
  });


  // Define the Handler Methods
  const handleOpen = store => () => {
    console.log('Alchemy Web Socket OPEN.');
    store.dispatch(setEthereumConnected(true));
    socket.send(newBlockSubscriptionRequest);
  }

  const handleMessage = store => (msg) => {
    let data = parseMessage(msg);

    if (!data) return; // Not a new block notification

    const blockNumber = Number(data.number); // Convert from hex
    const blockHash = data.hash;
    const logsBloom = data.logsBloom;
    const blockTime = dayjs().valueOf();

    if (latestObservedBlock >= blockNumber) {
      console.log(`Minor block re-org, skipping repeat blocknumber ${blockNumber}`);
      return;
    } else {
      console.log(`Updating blocknumber ${blockNumber}`);
      latestObservedBlock = blockNumber;
    }    

    // Check latest auction state and if settlement has occurred
    store.dispatch(checkAuctionAndSettlement({"logsBloom": logsBloom, "blockNumber": blockNumber}));

    // Update the Redux block information
    store.dispatch(setBlockAttr({'blockNumber': blockNumber, 'blockHash': blockHash, 'blockTime': blockTime}));
    store.dispatch(resetVotes());
  }

  const handleClose = store => () => {
    console.log('Alchemy Web Socket CLOSED.');
    store.dispatch(setEthereumConnected(false));
    store.dispatch(resetAuctionEnd());
  }


  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethereumSocket/open') {
      closeSocket();
      socket = openSocket();
      socket.onmessage = handleMessage(store);
      socket.onopen = handleOpen(store);
      socket.onclose = handleClose(store);
    }
    else if (action.type === 'ethereumSocket/close') {
      closeSocket();
    }
    else {
      return next(action);
    }
  };
};


export default alchemyWebsocketMiddleware();
export { openEthereumSocket, closeEthereumSocket };