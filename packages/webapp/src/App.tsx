import { useEffect, useMemo } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';

import { contract as AuctionContract } from './wrappers/nounsAuction';
import { setAuctionEnd } from './state/slices/auction';
import { setNextNounId, setDisplaySingleNoun } from './state/slices/noun';
import { setBlockAttr } from './state/slices/block';
import { provider } from './config';

import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import Noun from './components/Noun';
import Title from './components/Title';
import VoteBar from './components/VoteBar';
import Documentation from './components/Documentation';
import Banner from './components/Banner';
import Footer from './components/Footer';
import SettledAuctionModal from './components/SettledAuctionModal';

import { setActiveAccount } from './state/slices/account';
import { openVoteSocket, markVoterInactive } from './middleware/voteWebsocket';
import { openEthereumSocket } from './middleware/alchemyWebsocket';
import NotificationToast from './components/NotificationToast';
import CornerHelpText from './components/CornerHelpText';
import dayjs from 'dayjs';


function App() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.noun.isCoolBackground);
  const missedVotes = useAppSelector(state => state.vote.missedVotes);

  useMemo(async () => { // Initalized before mount
    const [{ number: blockNumber, hash: blockHash }, auction] = await Promise.all([
      provider.getBlock('latest'),
      AuctionContract.auction()
    ])

    // Setting block time to 1 min past now prevent players from
    // refreshing the page and passing multiple votes for the
    // current block
    const blockTime = dayjs().subtract(1, 'minute').valueOf();

    const nextNounId = parseInt(auction?.nounId) + 1;
    const auctionEnd = auction?.endTime.toNumber();

    dispatch(setNextNounId(nextNounId));
    dispatch(setAuctionEnd(auctionEnd));
    dispatch(setBlockAttr({ 'blockNumber': blockNumber, 'blockHash': blockHash, 'blockTime': blockTime }));
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
      <Title />
      <SettledAuctionModal />
      <Noun />
      <VoteBar />
      <Banner />
      <Documentation />
      <Footer />
      <CornerHelpText />
      <NotificationToast />
    </div>
  );
}

export default App;
