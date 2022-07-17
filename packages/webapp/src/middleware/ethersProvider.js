import { default as config, provider as RPCProvider} from '../config';

import { setPrevSettledBlockHash } from '../state/slices/settlement';
import { isTopicInBloom, isContractAddressInBloom } from 'ethereum-bloom-filters';
import { contract as AuctionContract } from '../wrappers/nounsAuction';
import { setAuctionEnd } from '../state/slices/auction';
import { setNextNounId } from '../state/slices/noun';
import { isSettleMethod as isAuctionSettleMethod } from '../utils/auctionMethods';
import { isSettleMethod as isFomoSettleMethod } from '../utils/fomoMethods';

// Define the Actions Intercepted by the Middleware
const checkAuctionAndSettlement = (payload) => ({type: 'ethereumProvider/checkAuctionAndSettlement', payload});

const settlementTopic = '0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99';
const auctionAddress = config.auctionProxyAddress;
const fomoAddress = config.fomoSettlerAddress;

const possibleSettleContracts = [auctionAddress, fomoAddress];

// Define the Middleware
const ethersProviderMiddleware = () => {
  let latestActiveNounId = undefined;

  // Bloom checks could give false positives
  const settlementInBloom = (logsBloom) => {
    try {
      return isTopicInBloom(logsBloom, settlementTopic) &&
            isContractAddressInBloom(logsBloom, auctionAddress);
    } catch {
      return false;
    }
  }

  const settleMethod = (input) => {
    return isFomoSettleMethod(input) || isAuctionSettleMethod(input);
  }

  // TODO: delete debug console outputs after testing
  const checkSettlementTx = async (store, blockNumber) => {
    if (!blockNumber) return;

    let blockWithTxs = await RPCProvider.getBlockWithTransactions(blockNumber);

    const settleTx = blockWithTxs.transactions.find(tx => possibleSettleContracts.includes(tx.to));

    if (settleTx && settleMethod(settleTx.data)) {
      const receipt = await settleTx.wait();

      if (receipt.status === 1) {
        console.log("debug - confirming settlement after checks")
        confirmSettlement(store, blockNumber);
      } else {
        console.log("Reverted tx")
      }
    } else {
      console.log("Couldn't find tx with auction settle call")
    }
  }

  const confirmSettlement = async (store, blockNumber) => {
    if (!blockNumber) return;
    const block = await RPCProvider.getBlock(blockNumber - 1);
    store.dispatch(setPrevSettledBlockHash(block.hash));
  }

  // TODO: delete debug console outputs after testing 
  const checkAuctionAndSettlement = async (store, logsBloom, blockNumber) => {
    // Check the latest auction status
    const auction = await AuctionContract.auction();

    const nounId = parseInt(auction?.nounId);
    const auctionEnd = auction?.endTime.toNumber();

    if (latestActiveNounId !== nounId && settlementInBloom(logsBloom)) {
      console.log("debug - requesting settlement confirmation")
      if (latestActiveNounId === undefined) {
        // Go more safe route by checking for settle tx
        // in a block and not base assumptions only on bloom
        // filters as they may give false positives 
        checkSettlementTx(store, blockNumber);
      } else {
        // Else if noun id has increased it means tx
        // that modified auction state run successefuly
        // and additional checks can be skipped
        confirmSettlement(store, blockNumber);
        console.log("debug - stright confirm")
      }
    }

    latestActiveNounId = nounId

    store.dispatch(setNextNounId(nounId + 1));
    store.dispatch(setAuctionEnd(auctionEnd));
  }

  // Define the Middleware
  return store => next => action => {
    if (action.type === 'ethereumProvider/checkAuctionAndSettlement') {
      const { logsBloom, blockNumber } = action.payload;

      checkAuctionAndSettlement(store, logsBloom, blockNumber);
    } else {
      return next(action);
    }
  };
};


export default ethersProviderMiddleware();
export { checkAuctionAndSettlement };