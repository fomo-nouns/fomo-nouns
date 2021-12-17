import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import classes from './App.module.css';
import Noun  from './components/Noun';
import SideContent from './components/SideContent';
import Timer from './components/Timer';
import Title from './components/Title';
import VoteBar from './components/VoteBar';
import VoteProgressBar from './components/VoteProgressBar';
import WalletConnectModal from './components/WalletConnectModal';
import { default as globalConfig, PROVIDER_KEY, provider} from './config';

import { providers } from 'ethers';
import { contract as AuctionContract } from './wrappers/nounsAuction';
import { setActiveAuction, setAuctionEnd } from './state/slices/auction';
import { setActiveAccount } from './state/slices/account';
import { setBlockHash, setBlockNumber } from './state/slices/block';
import { setNextNounId } from './state/slices/noun';
import { resetScore } from './state/slices/score';
import { resetVotes } from './state/slices/vote';
import dayjs from 'dayjs';
import { resetAttemptedSettle } from './state/slices/settle';
import { openVoteSocket } from './middleware/voteWebsocket';

// TODO: Make websocket connections more error proof (currently no resilience)
const ethersSocket = new providers.AlchemyWebSocketProvider(globalConfig.chainName, PROVIDER_KEY);


function App() {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.background.useGreyBg);
  const blockhash = useAppSelector(state => state.block.blockHash);

  useEffect(() => { // Only initialize after mount
    dispatch(openVoteSocket());

    /** On Alchemy WS, reload block information */
    ethersSocket.on('block', async (blockNumber) => {
      console.log(`Updating blocknumber ${blockNumber}`);
      dispatch(setBlockNumber(blockNumber));

      const block = await provider.getBlock(blockNumber);
      // console.log(`Updating blockhash ${block?.hash}`);
      dispatch(setBlockHash(block?.hash));

      const auction = await AuctionContract.auction();
      const nextNounId = parseInt(auction?.nounId) + 1;
      // console.log(`Updating nounId ${nextNounId}`);
      dispatch(setNextNounId(nextNounId));

      const auctionEnd = auction?.endTime.toNumber();
      const activeAuction = (auctionEnd - dayjs().unix()) > 0 ? true: false;
      dispatch(setAuctionEnd(auctionEnd));
      dispatch(setActiveAuction(activeAuction));
      dispatch(resetVotes());
      dispatch(resetScore());
      dispatch(resetAttemptedSettle());
    });

    const settledFilter = {
      address: AuctionContract.address,
      topics: [
        '0xc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99'
      ]
    };

    ethersSocket.on(settledFilter, (event) => {
      //TODO: Track if we settled it
      console.log(event);
    })
  }, [dispatch]);


  return (
    <div className={`${classes.App} ${useGreyBg ? classes.bgGrey : classes.bgBeige}`}>
      <WalletConnectModal/>
      <Title/>
      <VoteProgressBar/>
      <Timer/>
      <SideContent content={"How to play copy"}/>
      <Noun alt={"Crystal Ball Noun"}/>
      <VoteBar />
    </div>
  );
}

export default App;
