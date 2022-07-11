import { default as config, provider as RPCProvider} from '../config';

import { setPrevSettledBlockHash } from '../state/slices/settlement';
import { isTopicInBloom, isContractAddressInBloom } from 'ethereum-bloom-filters';
import { contract as AuctionContract } from '../wrappers/nounsAuction';
import { setAuctionEnd } from '../state/slices/auction';
import { setNextNounId } from '../state/slices/noun';

// Define the Actions Intercepted by the Middleware
const checkAuctionAndSettlement = (payload) => ({type: 'ethereumProvider/checkAuctionAndSettlement', payload});

const settlementTopic = '0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99';
const auctionAddress = config.auctionProxyAddress;
const settledFilter = {address: auctionAddress, topics: [settlementTopic]};


// Define the Middleware
const ethersProviderMiddleware = () => {
  let latestActiveNounId = 0;

  // Define the Handler Methods
  const settlementInBloom = (logsBloom) => {
    try {
      return isTopicInBloom(logsBloom, settlementTopic) &&
            isContractAddressInBloom(logsBloom, auctionAddress);
    } catch {
      return false;
    }
  }

  const confirmSettlement = async (store, blockNumber) => {
    if (!blockNumber) return;
    const block = await RPCProvider.getBlock(blockNumber - 1);
    store.dispatch(setPrevSettledBlockHash(block.hash));
  }

  const tbh = async (blockNumber) => {
    if (!blockNumber) return;
    // let block = await RPCProvider.getBlock(blockNumber - 1);

    let blockWithTxs = await RPCProvider.getBlockWithTransactions(blockNumber);

    const settleTx = blockWithTxs.transactions.find(tx => tx.to === auctionAddress)
    console.log("settle tx from settle block")
    console.log(settleTx)

    if (settleTx) {
      const receipt = await settleTx.wait();

      console.log("receipt from settle tx from settle block")
      console.log(receipt)

      console.log("receipt status. tx is success")
      console.log(receipt.status === 1)
    }
  }

  const checkAuctionAndSettlement = async (store, logsBloom, blockNumber) => {
    // Check the latest auction status
    const auction = await AuctionContract.auction();

    console.log("auction data")
    console.log(auction)

    const nounId = parseInt(auction?.nounId);
    const auctionEnd = auction?.endTime.toNumber();

    console.log("latestActiveNounId")
    console.log(latestActiveNounId)

    console.log("new nounId")
    console.log(nounId)

    if (latestActiveNounId !== nounId && settlementInBloom(logsBloom)) {
      console.log("requesting settlement confirmation")
      confirmSettlement(store, blockNumber);
      tbh(blockNumber)
    }

    latestActiveNounId = nounId

    store.dispatch(setNextNounId(nounId + 1));
    store.dispatch(setAuctionEnd(auctionEnd));
  }

  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethereumProvider/checkAuctionAndSettlement') {
      const { logsBloom, blockNumber } = action.payload;

      console.log("logsBloom")
      console.log(logsBloom)

      console.log("blockNumber")
      console.log(blockNumber)

      checkAuctionAndSettlement(store, logsBloom, blockNumber)
    } else {
      return next(action);
    }
  };
};


export default ethersProviderMiddleware();
export { checkAuctionAndSettlement };