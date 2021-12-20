import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";
import AuctionTimer from '../AuctionTimer';
import BlockTimer from '../BlockTimer';


const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const voteConnected = useAppSelector(state => state.vote.connected);
  const ethereumConnected = useAppSelector(state => state.block.connected);
  const blockHash = useAppSelector(state => state.block.blockHash);

  let titleText = '';
  if (!voteConnected || !ethereumConnected) {
    titleText = `Awaiting connection...`;
  } else if (!blockHash || activeAuction === undefined) {
    titleText = `Loading next block...`;
  } else if (activeAuction) {
    titleText = `Come back at Noun O'Clock in:`;
  } else if (attemptedSettle) {
    titleText = `Attempting to settle...`;
  } else if (votingActive) {
    titleText = `Should we mint this Noun?`;
  } else if (!activeAuction && !votingActive) {
    titleText = `Time's up! Waiting for next block...`;
  } else {
    titleText = 'Loading FOMO Nouns...';
  }

  return (
    <div className={classes.Wrapper}>
      <h1 className={classes.Title}>
        {titleText}
        {!activeAuction ? (<BlockTimer/>) : (<AuctionTimer/>)}
      </h1>
    </div>
  )
};

export default Title;