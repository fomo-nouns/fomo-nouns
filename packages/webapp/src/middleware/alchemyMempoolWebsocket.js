import { default as globalConfig, PROVIDER_KEY } from '../config';
import { resetAuctionEnd } from '../state/slices/auction';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { default as config } from '../config';


// Define the Actions Intercepted by the Middleware
const openEthereumMempoolSocket = (payload) => ({type: 'ethereumMempoolSocket/open', payload});
const closeEthereumMempoolSocket = (payload) => ({type: 'ethereumMempoolSocket/close', payload});

const settleMethodIds = ['0xf25efffc', '0x1b16802c']
const auctionAddress = config.auctionProxyAddress;
const settlerAddress = config.fomoSettlerAddress;

// Define the Middleware
const alchemyMempoolWebsocketMiddleware = () => {
  let socket = null;
  let blockSubscription = '0x';
  let blockId = 44;
  // let latestObservedBlock = 0;

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
      // TODO: update address to auction proxy
      { toAddress: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"] },
    ]
  });


  // Define the Handler Methods
  const handleOpen = store => () => {
    console.log('Alchemy Mempool Hawk Web Socket OPEN.');
    // TODO: update this
    // store.dispatch(setEthereumConnected(true));
    socket.send(newTxSubscriptionRequest);
  }

  // TODO: update this
  const handleMessage = store => (msg) => {
    let data = parseMessage(msg);

    if (!data) return;

    const methodId = data.input.slice(0, 10);

    const isSettleTx = settleMethodIds.includes(methodId);
    const fromFomo = data.from === settlerAddress;

    console.log(methodId)

    // const logsBloom = data.logsBloom; 

    // Check if settlement has occurred
    // store.dispatch(checkForSettlement(logsBloom));

    // Check the latest auction status
    // AuctionContract.auction().then((auction) => {
    //   const nextNounId = parseInt(auction?.nounId) + 1;
    //   const auctionEnd = auction?.endTime.toNumber();

    //   store.dispatch(setNextNounId(nextNounId));
    //   store.dispatch(setAuctionEnd(auctionEnd));
    // });

    // Update the Redux block information
    // store.dispatch(setBlockAttr({'blocknumber': blockNumber, 'blockhash': blockHash}));
    // store.dispatch(resetVotes());
  }

  const handleClose = store => () => {
    console.log('Alchemy Mempool Hawk Web Socket CLOSED.');
    // TODO: update this
    // Connection usually only closed by Alchemy
    // store.dispatch(setEthereumConnected(false));
    store.dispatch(resetAuctionEnd());
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