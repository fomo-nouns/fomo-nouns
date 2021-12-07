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
import {w3cwebsocket as W3CWebSocket } from 'websocket';
import { default as globalConfig, FOMO_WEBSOCKET, PROVIDER_KEY, provider} from './config';

import { providers } from 'ethers';
import { contract as AuctionContract } from './wrappers/nounsAuction';
import { setActiveAuction, setAuctionEnd } from './state/slices/auction';
import { setActiveAccount } from './state/slices/account';
import { setBlockHash, setBlockNumber } from './state/slices/block';
import { setNextNounId } from './state/slices/noun';
import { setScore, resetScore } from './state/slices/score';
import { incrementCount, resetVotes } from './state/slices/vote';
import { setConnected } from './state/slices/websocket';
import dayjs from 'dayjs';
import { resetAttemptedSettle, setAttemptedSettle } from './state/slices/settle';
import { setNumConnections } from './state/slices/connections';

// TODO: Make websocket connections more error proof (currently no resilience)
const client = new W3CWebSocket(FOMO_WEBSOCKET);
const ethersSocket = new providers.AlchemyWebSocketProvider(globalConfig.chainName, PROVIDER_KEY);


function App() {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.background.useGreyBg);
  const blockhash = useAppSelector(state => state.block.blockHash);

  useEffect(() => { // Only initialize after mount
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

  /** On Vote WS, update votes or settlement */
  client.onopen = () => {
    console.log('FOMO Web Socket OPEN.');
    dispatch(setConnected(true));
    dispatch(setActiveAccount(account));
  };
  
  client.onmessage = function(msg) {
    try {      
      const data = JSON.parse(String(msg.data));
      console.log(data);
      if ('vote' in data && blockhash === data.blockhash) {
        dispatch(incrementCount(data.vote));
      }
      if ('score' in data && blockhash === data.blockhash) {
        dispatch(setScore(data.score));
      }
      if (data.settlementAttempted && blockhash === data.blockhash) {
        dispatch(setAttemptedSettle(true));
      }
      if('connections' in data) {
        dispatch(setNumConnections(data.connections));
      }
    } catch(err) {
      console.error('Erroring parsing FOMO websocket message');
      console.error(err);
    }
  };

  client.onclose = () => {
    console.log('FOMO Web Socket CLOSED.');
  };


  return (
    <div className={`${classes.App} ${useGreyBg ? classes.bgGrey : classes.bgBeige}`}>
      <WalletConnectModal/>
      <Title/>
      <VoteProgressBar/>
      <Timer/>
      <SideContent content={"How to play copy"}/>
      <Noun alt={"Crystal Ball Noun"}/>
      <VoteBar client={client}/>
    </div>
  );
}

export default App;
