import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";
import AuctionTimer from '../AuctionTimer';
import BlockCountdownTimer from '../BlockCountdownTimer';
import Gradient, { GradientStyle } from "../Gradient";

const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const closeToAuctionEnd = useAppSelector(state => state.auction.closeToEnd);
  const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const ethereumConnected = useAppSelector(state => state.block.connected);
  const blockHash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;

  // let timerSpacer = (<div className={classes.timerSpacer}>&nbsp;</div>);

  let title = <></>;
  if (!ethereumConnected) {
    title = (<>Awaiting connection...</>);
    // title = `Awaiting connection...`;
    // timer = timerSpacer;
  } else if (!blockHash || activeAuction === undefined) {
    title = (<>Waiting for next block...</>);
    // title = `Waiting for next block...`;
    // timer = timerSpacer;
  } else if (activeAuction && !closeToAuctionEnd) {
    title = (<div className={classes.oneLine}><div>Play with us in:</div><AuctionTimer /></div>);
    {/* title = `Play with us in:`;
    timer = <AuctionTimer/>; */}
  } else if (activeAuction && closeToAuctionEnd) {
    title = (<div className={classes.oneLine}><Gradient style={GradientStyle.FUCHSIA_PURPLE}>Play with us in:</Gradient><AuctionTimer /></div>);
    // title = `We're starting in just `;
    // timer = <AuctionTimer />;
  } else if (attemptedSettle) {
    title = (<>Attempting to settle...</>);
    // title = `Attempting to settle...`;
    // timer = timerSpacer;
  } else if (votingActive) {
    title = (<div><div>Should we mint {nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}?</div><BlockCountdownTimer /></div>);
    // title = `Should we mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}?`;
    // timer = <BlockCountdownTimer />;
  } else if (!activeAuction && !votingActive) {
    title = (<div><div>Time's up! Waiting for next block...</div><BlockCountdownTimer /></div>);
    // title = `Time's up! Waiting for next block...`;
    // timer = <BlockCountdownTimer />;
  } else {
    title = (<>Loading FOMO Nouns...</>);
    // title = 'Loading FOMO Nouns...';
    // timer = <></>;
  }

  return (
    <div className={classes.Wrapper}>
      <h1 className={classes.Title}>
        {title}
      </h1>
    </div>
  )
};

export default Title;