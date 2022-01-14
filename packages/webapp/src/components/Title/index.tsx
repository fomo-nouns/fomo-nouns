import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";
import AuctionTimer from '../AuctionTimer';
import BlockCountdownTimer from '../BlockCountdownTimer';

const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const ethereumConnected = useAppSelector(state => state.block.connected);
  const blockHash = useAppSelector(state => state.block.blockHash);

  let timerSpacer = (<div className={classes.timerSpacer}>&nbsp;</div>);

  let titleText = '', timer = <></>;
  if (!ethereumConnected) {
    titleText = `Awaiting connection...`;
    timer = timerSpacer;
  } else if (!blockHash || activeAuction === undefined) {
    titleText = `Loading next block...`;
    timer = timerSpacer;
  } else if (activeAuction) {
    titleText = `Come back at Noun O'Clock in:`;
    timer = <AuctionTimer/>;
  } else if (attemptedSettle) {
    titleText = `Attempting to settle...`;
    timer = timerSpacer;
  } else if (votingActive) {
    titleText = `Should we mint this Noun?`;
    timer = <BlockCountdownTimer/>;
  } else if (!activeAuction && !votingActive) {
    titleText = `Time's up! Waiting for next block...`;
    timer = <BlockCountdownTimer/>;
  } else {
    titleText = 'Loading FOMO Nouns...';
    timer = <></>;
  }

  return (
    <div className={classes.Wrapper}>
      <h1 className={classes.Title}>
        {titleText}
        {timer}
      </h1>
    </div>
  )
};

export default Title;