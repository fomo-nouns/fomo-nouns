import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import classes from './App.module.css';
import Noun  from './components/Noun';
import Title from './components/Title/Title';
import VoteBar from './components/VoteBar';
import WalletConnectModal from './components/WalletConnectModal';
import {w3cwebsocket as W3CWebSocket} from 'websocket';
import { setConnected } from './state/slices/websocket';

function App() {
  require('dotenv').config();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const client = new W3CWebSocket(process.env.REACT_APP_WEBSOCKET!);
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.background.useGreyBg);
  useEffect(() => {
    client.onopen = () => {
      console.log("connected to websocket");
      dispatch(setConnected(true));
    }
    dispatch(setActiveAccount(account));
  }, [account, dispatch, client]);

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
