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
    titleText = `It's not Noun O'Clock yet. Come back in:`;
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