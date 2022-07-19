import { default as globalConfig, PROVIDER_KEY } from '../config';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { default as config } from '../config';
import { addPendingBidTx, addPendingSettleTx, setMempoolListening } from '../state/slices/mempool';
import { isBidMethod, isSettleMethod } from '../utils/auctionMethods';


// Define the Actions Intercepted by the Middleware
const openEthereumMempoolSocket = (payload) => ({type: 'ethereumMempoolSocket/open', payload});
const closeEthereumMempoolSocket = (payload) => ({type: 'ethereumMempoolSocket/close', payload});

const auctionAddress = config.auctionProxyAddress;
// TODO: move executor address to /config.ts
const fomoExecutorAddress = '0x85906cF629ae1DA297548769ecE3e3E6a4f3288f';

// Define the Middleware
const alchemyMempoolWebsocketMiddleware = () => {
  let socket = null;
  let blockSubscription = '0x';
  let blockId = 44;

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

  const newTxSubscriptionRequest = JSON.stringify({
    "jsonrpc":"2.0",
    "id": blockId,
    "method": "eth_subscribe",
    "params": [
      "alchemy_pendingTransactions",
      { toAddress: [auctionAddress] },
    ]
  });

  const handleOpen = store => () => {
    console.log('Alchemy Mempool Hawk Web Socket OPEN.');
    store.dispatch(setMempoolListening(true));
    socket.send(newTxSubscriptionRequest);
  }

  const handleMessage = store => (msg) => {
    let data = parseMessage(msg);

    if (!data) return;

    const isSettleTx = isSettleMethod(data.input);
    const fromFomo = data.from === fomoExecutorAddress;
    const isBidTx = isBidMethod(data.input);

    if (isSettleTx && !fromFomo) {
      store.dispatch(addPendingSettleTx({ from: data.from, hash: data.hash }))
    }
    if (isBidTx) {
      store.dispatch(addPendingBidTx({ from: data.from, hash: data.hash, value: data.value }))
    }
  }

  const handleClose = store => () => {
    console.log('Alchemy Mempool Hawk Web Socket CLOSED.');
    store.dispatch(setMempoolListening(false));
  }


  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethereumMempoolSocket/open') {
      closeSocket();
      socket = openSocket();
      socket.onmessage = handleMessage(store);
      socket.onopen = handleOpen(store);
      socket.onclose = handleClose(store);
    }
    else if (action.type === 'ethereumMempoolSocket/close') {
      closeSocket();
    }
    else {
      return next(action);
    }
  };
};


export default alchemyMempoolWebsocketMiddleware();
export { openEthereumMempoolSocket, closeEthereumMempoolSocket };