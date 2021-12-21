import { provider as RPCProvider} from '../config';

import { contract as AuctionContract } from '../wrappers/nounsAuction';
import { setPrevSettledBlockHash } from '../state/slices/settlement';

// Define the Actions Intercepted by the Middleware
const openEthereumProvider = (payload) => ({type: 'ethereumProvider/open', payload});

const settledFilter = {
  address: AuctionContract.address,
  topics: [
    '0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99'
  ]
};

// Define the Middleware
const ethersProviderMiddleware = () => {
  let provider = null;

  const openProvider = () => RPCProvider;

  const handleSettlementTrxn = store => async (event) => { 
    const block = await provider.getBlock(event.blockNumber - 1);
    store.dispatch(setPrevSettledBlockHash(block.hash));
  }


  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethereumProvider/open') {
      provider = openProvider();
      provider.on(settledFilter, handleSettlementTrxn(store));
    }
    else {
      return next(action);
    }
  };
};


export default ethersProviderMiddleware();
export { openEthereumProvider};