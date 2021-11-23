import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import { setBlockHash, setBlockNumber } from './state/slices/block';
import classes from './App.module.css';
import Noun  from './components/Noun';
import Title from './components/Title/Title';
import VoteBar from './components/VoteBar';
import WalletConnectModal from './components/WalletConnectModal';
import {w3cwebsocket as W3CWebSocket } from 'websocket';
import { setConnected } from './state/slices/websocket';
import { default as globalConfig, FOMO_WEBSOCKET, PROVIDER_KEY, provider} from './config';

import { providers } from 'ethers';
import { contract as AuctionContract } from './wrappers/nounsAuction';
import { setNextNounId } from './state/slices/noun';
import { incrementCount, resetVotes } from './state/slices/vote';
import VoteProgressBar from './components/VoteProgressBar';
import SideContent from './components/SideContent/SideContent';

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
      console.log(`Updating blockhash ${block?.hash}`);
      dispatch(setBlockHash(block?.hash));

      const auction = await AuctionContract.auction();
      const nextNounId = parseInt(auction?.nounId) + 1;
      console.log(`Updating nounId ${nextNounId}`);
      dispatch(setNextNounId(nextNounId));

      dispatch(resetVotes());
    });
  }, [dispatch]);

  /** On Vote WS, update votes or settlement */
  client.onopen = () => {
    console.log('FOMO Web Socket OPEN.');
    dispatch(setConnected(true));
    dispatch(setActiveAccount(account));
  };
  
  client.onmessage = function(msg) {
    console.log(msg);
    try {      
      const data = JSON.parse(String(msg.data));
      if ('vote' in data && blockhash === data.blockhash) {
        dispatch(incrementCount(data.vote));
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
      <Title content={"FOMO Nouns\nShould we mint this Noun?"}/>
      <VoteProgressBar progress={60}/>
      <SideContent content={"How to Play: fhjdkasfhjdskalfhjkdlsa"}/>
      <Noun alt={"Crystal Ball Noun"}/>
      <VoteBar client={client}/>
    </div>
  );
}

export default App;
