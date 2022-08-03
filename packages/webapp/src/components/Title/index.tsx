import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";
import AuctionTimer from '../AuctionTimer';
import BlockCountdownTimer from '../BlockCountdownTimer';
import Gradient, { GradientStyle } from "../Gradient";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";

const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const closeToAuctionEnd = useAppSelector(state => state.auction.closeToEnd);
  const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const ethereumConnected = useAppSelector(state => state.block.connected);
  const blockHash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;

  let timerSpacer = (<div className={classes.timerSpacer}>&nbsp;</div>);

  let title = <></>;
  if (!ethereumConnected) {
    title = (<>Awaiting connection...{timerSpacer}</>);
  } else if (!blockHash || activeAuction === undefined) {
    title = (<>Waiting for next block...{timerSpacer}</>);
  } else if (activeAuction && !closeToAuctionEnd) {
    title = (<div><div>Choose next noun with us in:</div><AuctionTimer /></div>);
  } else if (activeAuction && closeToAuctionEnd) {
    title = (<div><Gradient style={GradientStyle.FUCHSIA_PURPLE}><div>We are starting in just:</div><AuctionTimer /></Gradient></div>);
  } else if (attemptedSettle) {
    title = (<><Gradient style={GradientStyle.FUCHSIA_PURPLE}>Attempting to settle...</Gradient><div>{timerSpacer}</div></>);
  } else if (votingActive) {
    title = (<div><div>Should we mint {nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}?</div><BlockCountdownTimer /></div>);
  } else if (!activeAuction && !votingActive) {
    title = (<div><div>Time's up! Waiting for next block...</div><BlockCountdownTimer /></div>);
  } else {
    title = (<>Loading FOMO Nouns...</>);
  }

  const style = usePickByState(
    classes.cool,
    classes.warm,
  );

  return (
    <div className={classes.wrapper}>
      <h1 className={clsx(classes.title, style)}>
        {title}
      </h1>
    </div>
  )
};

export default Title;