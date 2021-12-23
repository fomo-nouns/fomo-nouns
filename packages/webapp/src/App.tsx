import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';

import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import Noun  from './components/Noun';
import Title from './components/Title';
import VoteBar from './components/VoteBar';
import VoteProgressBar from './components/VoteProgressBar';
import Documentation from './components/Documentation';
import Banner from './components/Banner';
import Footer from './components/Footer';
import SettledAuctionModal from './components/SettledAuctionModal';

import { setActiveAccount } from './state/slices/account';
import { openVoteSocket } from './middleware/voteWebsocket';
import { openEthereumSocket } from './middleware/alchemyWebsocket';



function App() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.noun.useGreyBg);

  useEffect(() => {
    dispatch(setActiveAccount(account));
  }, [dispatch, account]);

  useEffect(() => { // Only initialize after mount
    dispatch(openVoteSocket());
    dispatch(openEthereumSocket());
  }, [dispatch]);


  return (
    <div className={`${classes.App} ${useGreyBg ? classes.bgGrey : classes.bgBeige}`}>
      <NavBar />
      <Title/>
      <VoteProgressBar/>
      <SettledAuctionModal/>
      <Noun alt={"Current Block Noun"}/>
      <VoteBar />
      <Banner />
      <Documentation />
      <Footer/>
    </div>
  );
}

export default App;
