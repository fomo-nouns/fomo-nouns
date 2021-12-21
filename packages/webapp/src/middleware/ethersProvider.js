import { default as config, provider as RPCProvider} from '../config';

import { setPrevSettledBlockHash } from '../state/slices/settlement';
import { isTopicInBloom, isContractAddressInBloom } from 'ethereum-bloom-filters';

// Define the Actions Intercepted by the Middleware
const checkForSettlement = (payload) => ({type: 'ethereumProvider/checkSettlement', payload});

const settlementTopic = '0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99';
const auctionAddress = config.auctionProxyAddress;
const settledFilter = {address: auctionAddress, topics: [settlementTopic]};


// Define the Middleware
const ethersProviderMiddleware = () => {

  // Define the Handler Methods
  const settlementInBloom = (logsBloom) => {
    try {
      return isTopicInBloom(logsBloom, settlementTopic) &&
            isContractAddressInBloom(logsBloom, auctionAddress);
    } catch {
      return false;
    }
  }

  const confirmSettlement = (store) => {
    RPCProvider.getLogs(settledFilter)
      .then((logs) => logs[0]?.blockNumber)
      .then(async (blockNumber) => {
        if (!blockNumber) return;
        let block = await RPCProvider.getBlock(blockNumber - 1);
        store.dispatch(setPrevSettledBlockHash(block.hash));
      })
      .catch(() => {
        console.log('Error parsing settlement logs');
      });
  }

  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethereumProvider/checkSettlement') {
      const logsBloom = action.payload;
      if (settlementInBloom(logsBloom)) {
        confirmSettlement(store);
      }
    } else {
      return next(action);
    }
  };
};


export default ethersProviderMiddleware();
export { checkForSettlement };