import { useEffect, useMemo } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';

import { contract as AuctionContract } from './wrappers/nounsAuction';
import { setAuctionEnd } from './state/slices/auction';
import { setNextNounId } from './state/slices/noun';
import { setBlockAttr } from './state/slices/block';
import { provider } from './config';

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
import { openVoteSocket, markVoterInactive } from './middleware/voteWebsocket';
import { openEthereumSocket } from './middleware/alchemyWebsocket';



function App() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.noun.useGreyBg);
  const missedVotes = useAppSelector(state => state.vote.missedVotes);

  useMemo(async ()=> { // Initalized before mount
    const [{number: blocknumber, hash: blockhash}, auction] = await Promise.all([
      provider.getBlock('latest'),
      AuctionContract.auction()
    ])

    const nextNounId = parseInt(auction?.nounId) + 1;
    const auctionEnd = auction?.endTime.toNumber();

    dispatch(setNextNounId(nextNounId));
    dispatch(setAuctionEnd(auctionEnd));
    dispatch(setBlockAttr({blocknumber, blockhash}))
  }, [dispatch])

  useEffect(() => {
    dispatch(setActiveAccount(account));
  }, [dispatch, account]);

  useEffect(() => { // Only initialize after mount
    dispatch(openVoteSocket());
    dispatch(openEthereumSocket());
  }, [dispatch]);

  // Deal with inactive users
  useEffect(() => {
    if (missedVotes > 3) {
      dispatch(markVoterInactive());
    }
  }, [dispatch, missedVotes]);


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
