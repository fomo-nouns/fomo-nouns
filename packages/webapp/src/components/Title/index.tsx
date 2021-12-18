import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";
import AuctionTimer from '../AuctionTimer';
import BlockTimer from '../BlockTimer';


const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
  const votingActive = useAppSelector(state => state.vote.votingActive);

  let titleText = '';
  if (activeAuction) {
    titleText = `Voting starts at Noun O'Clock in:`;
  } else if (attemptedSettle) {
    titleText = `Attempting to settle!`;
  } else if (votingActive) {
    titleText = `Vote if we should mint this Noun!`;
  } else if (!activeAuction && !votingActive) {
    titleText = `Times up! Waiting for next block...`;
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