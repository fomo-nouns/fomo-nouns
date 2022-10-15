import { useCallback, useEffect, useMemo } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';

import { contract as AuctionContract } from './wrappers/nounsAuction';
import { setAuctionEnd } from './state/slices/auction';
import { setNextNounId, setDisplaySingleNoun } from './state/slices/noun';
import { setBlockAttr } from './state/slices/block';
import { provider, RECAPTCHA_ACTION_NAME } from './config';

import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from './components/NavBar';
import Noun from './components/Noun';
import Title from './components/Title';
import VoteBar from './components/VoteBar';
import VoteProgressBar from './components/VoteProgressBar';
import Documentation from './components/Documentation';
import Banner from './components/Banner';
import Footer from './components/Footer';
import SettledAuctionModal from './components/SettledAuctionModal';
import NotificationToast from './components/NotificationToast';

import { setActiveAccount } from './state/slices/account';
import { openVoteSocket, markVoterInactive } from './middleware/voteWebsocket';
import { openEthereumSocket } from './middleware/alchemyWebsocket';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';



function App() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const isCoolBackground = useAppSelector(state => state.noun.isCoolBackground);
  const missedVotes = useAppSelector(state => state.vote.missedVotes);

  useMemo(async () => { // Initalized before mount
    const [{ number: blocknumber, hash: blockhash }, auction] = await Promise.all([
      provider.getBlock('latest'),
      AuctionContract.auction()
    ])

    const nextNounId = parseInt(auction?.nounId) + 1;
    const auctionEnd = auction?.endTime.toNumber();

    dispatch(setNextNounId(nextNounId));
    dispatch(setAuctionEnd(auctionEnd));
    dispatch(setBlockAttr({ blocknumber, blockhash }))
    if (nextNounId === 420) {
      dispatch(setDisplaySingleNoun(false));
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(setActiveAccount(account));
  }, [dispatch, account]);

  useEffect(() => { // Only initialize after mount
    dispatch(openEthereumSocket());
  }, [dispatch]);

  // Deal with inactive users
  useEffect(() => {
    if (missedVotes > 3) {
      dispatch(markVoterInactive());
    }
  }, [dispatch, missedVotes]);

  const reCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha(RECAPTCHA_ACTION_NAME);
    console.log('recaptcha token')
    console.log(token)
    dispatch(openVoteSocket()); // TODO: pass token
  }, [executeRecaptcha, dispatch]);

  // Get reCaptcha user token and open vote socket
  useEffect(() => {
    reCaptchaVerify();
  }, [reCaptchaVerify]);

  return (
    <div className={`${classes.App} ${isCoolBackground ? classes.bgGrey : classes.bgBeige}`}>
      <NavBar />
      <Title />
      <VoteProgressBar />
      <SettledAuctionModal />
      <Noun />
      <VoteBar />
      <Banner />
      <Documentation />
      <Footer />
      <NotificationToast />
    </div>
  );
}

export default App;
