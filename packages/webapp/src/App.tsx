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

import { setActiveAccount } from './state/slices/account';
import { openVoteSocket } from './middleware/voteWebsocket';
import { openEthersSocket } from './middleware/ethersWebsocket';


function App() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.background.useGreyBg);

  useEffect(() => {
    dispatch(setActiveAccount(account));
  }, [account]);

  useEffect(() => { // Only initialize after mount
    dispatch(openVoteSocket());
    dispatch(openEthersSocket());
  }, []);


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
