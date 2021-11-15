import { useCallback, useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import block, { setBlockHash, setBlockNumber } from './state/slices/block';
import classes from './App.module.css';
import Noun  from './components/Noun';
import Title from './components/Title/Title';
import VoteBar from './components/VoteBar';
import WalletConnectModal from './components/WalletConnectModal';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import { setConnected } from './state/slices/websocket';
import {provider} from './config';

function App() {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = new W3CWebSocket(process.env.REACT_APP_WEB_SOCKET!);
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.background.useGreyBg);

  const currentBlock = useAppSelector(state => state.block.blockNumber);

  const getAndSetBlockHash = useCallback( async (blockNumber) => {
    const block = await provider.getBlock(blockNumber)
    dispatch(setBlockHash(block.hash));
  }, [dispatch]);

  useEffect(() => {
    provider.once('block', (blockNumber) => {
      if(currentBlock === undefined || blockNumber > currentBlock) {
        dispatch(setBlockNumber(blockNumber));
        dispatch(setBlockHash(blockNumber.hash));
        getAndSetBlockHash(blockNumber);
      }
    });
    client.onopen = () => {
      dispatch(setConnected(true));
    }
    dispatch(setActiveAccount(account));
  }, [account, dispatch, client, currentBlock, getAndSetBlockHash]);

  return (
    <div className={`${classes.App} ${useGreyBg ? classes.bgGrey : classes.bgBeige}`}>
      <WalletConnectModal/>
      <Title content={"Noun, Noun Crystal Ball\nWho's the Nounish of them all?"}/>
      <Noun alt={"Crystal Ball Noun"}/>
      <VoteBar client={client}/>
    </div>
  );
}

export default App;
