import { default as globalConfig, PROVIDER_KEY, provider} from '../config';

import { providers } from 'ethers';
import { contract as AuctionContract } from '../wrappers/nounsAuction';
import { setActiveAuction, setAuctionEnd } from '../state/slices/auction';
import { setBlockAttr } from '../state/slices/block';
import { setNextNounId } from '../state/slices/noun';
import { resetVotes } from '../state/slices/vote'; 
import dayjs from 'dayjs';

// Define the Actions Intercepted by the Middleware
const openEthersSocket = (payload) => ({type: 'ethersSocket/open', payload});
const closeEthersSocket = (payload) => ({type: 'ethersSocket/close', payload});

const settledFilter = {
  address: AuctionContract.address,
  topics: [
    '0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99'
  ]
};

// Define the Middleware
const ethersWebsocketMiddleware = () => {
  let socket = null;

  const openSocket = () => new providers.AlchemyWebSocketProvider(globalConfig.chainName, PROVIDER_KEY);
  const closeSocket = () => { if (socket !== null) socket.destroy() };


  // Define the Handler Methods
  const handleNewBlock = store => async (blockNumber) => {
    const block = await provider.getBlock(blockNumber);
    const auction = await AuctionContract.auction();

    const nextNounId = parseInt(auction?.nounId) + 1;
    const auctionEnd = auction?.endTime.toNumber();
    const activeAuction = (auctionEnd - dayjs().unix()) > 0 ? true: false;
    
    console.log(`Updating blocknumber ${blockNumber}`);
    store.dispatch(setBlockAttr({'blocknumber': blockNumber, 'blockhash': block?.hash}));
    store.dispatch(setNextNounId(nextNounId));
    store.dispatch(setAuctionEnd(auctionEnd));
    store.dispatch(setActiveAuction(activeAuction));
    store.dispatch(resetVotes());
  }

  const handleSettlementTrxn = store => async (event) => {
    console.log(event);
  }


  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethersSocket/open') {
      closeSocket();
      socket = openSocket();
      socket.on('block', handleNewBlock(store));
      socket.on(settledFilter, handleSettlementTrxn(store));
    }
    else if (action.type === 'ethersSocket/close') {
      closeSocket();
    }
    else {
      return next(action);
    }
  };
};


export default ethersWebsocketMiddleware();
export { openEthersSocket, closeEthersSocket };