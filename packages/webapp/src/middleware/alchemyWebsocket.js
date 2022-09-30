import { default as globalConfig, PROVIDER_KEY } from '../config';

import { setEthereumConnected, setBlockAttr } from '../state/slices/block';
import { resetVotes } from '../state/slices/vote';
import { resetAuctionEnd } from '../state/slices/auction';
import { default as config } from '../config';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { checkAuctionAndSettlement } from './ethersProvider';
import { addPendingBidTx, addPendingSettleTx } from '../state/slices/mempool';
import { isBidMethod, isSettleMethod } from '../utils/auctionMethods';


// Define the Actions Intercepted by the Middleware
const openEthereumSocket = (payload) => ({type: 'ethereumSocket/open', payload});
const closeEthereumSocket = (payload) => ({type: 'ethereumSocket/close', payload});

const auctionAddress = config.auctionProxyAddress;
const fomoExecutorAddress = config.fomoExecutorAddress;

// Define the Middleware
const alchemyWebsocketMiddleware = () => {
  let socket = null;
  let subscriptions = [];
  let latestObservedBlock = 0;

  const openSocket = () => new W3CWebSocket(`wss://eth-${globalConfig.chainName}.alchemyapi.io/v2/${PROVIDER_KEY}`);
  const closeSocket = () => { if (socket !== null) socket.close() };

  // Websocket Parsing & Sending Message
  const parseMessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (subscriptions.includes(data?.params?.subscription)) {
        return data.params.result;
      } else if (data.id && data.result) {
        subscriptions.push(data.result);
      }
    } catch(e) {
      console.log('Error parsing Alchemy websocket message');
      console.log(e);
    }
  }

  const newBlockSubscriptionRequest = JSON.stringify({
    "jsonrpc":"2.0",
    "id": '44',
    "method": "eth_subscribe",
    "params": ["newHeads"]
  });

  const newTxSubscriptionRequest = JSON.stringify({
    "jsonrpc": "2.0",
    "id": '45',
    "method": "eth_subscribe",
    "params": [
      "alchemy_pendingTransactions",
      { toAddress: [auctionAddress] },
    ]
  });

  // Define the Handler Methods
  const handleOpen = store => () => {
    console.log('Alchemy Web Socket OPEN.');
    socket.send(newBlockSubscriptionRequest);
    store.dispatch(setEthereumConnected(true));
    socket.send(newTxSubscriptionRequest);
  }

  const handleNewBlock = (store, data) => {
    if (!data.number) return; // Not a new block notification
     
    const blockNumber = Number(data.number); // Convert from hex
    const blockHash = data.hash;
    const logsBloom = data.logsBloom;

    if (latestObservedBlock >= blockNumber) {
      console.log(`Minor block re-org, skipping repeat blocknumber ${blockNumber}`);
      return;
    } else {
      console.log(`Updating blocknumber ${blockNumber}`);
      latestObservedBlock = blockNumber;
    }

    // Check latest auction state and if settlement has occurred
    store.dispatch(checkAuctionAndSettlement({ "logsBloom": logsBloom, "blockNumber": blockNumber }));

    // Update the Redux block information
    store.dispatch(setBlockAttr({'blocknumber': blockNumber, 'blockhash': blockHash}));
    store.dispatch(resetVotes());
  }

  const handlePendingTx = (store, data) => {
    if (!data.input) return; // Not a pending tx notification

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

  const handleMessage = store => (msg) => {
    let data = parseMessage(msg);

    if (!data) return;

    handleNewBlock(store, data)
    handlePendingTx(store, data)
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
    } else {
      return next(action);
    }
  };
};


export default alchemyWebsocketMiddleware();
export { openEthereumSocket, closeEthereumSocket };