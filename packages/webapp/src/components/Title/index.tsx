import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";
import AuctionTimer from '../AuctionTimer';
import Gradient, { GradientStyle } from "../Gradient";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";
import PlayTitle from "../PlayTitle";

const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const closeToAuctionEnd = useAppSelector(state => state.auction.closeToEnd);
  const ethereumConnected = useAppSelector(state => state.block.connected);
  const blockHash = useAppSelector(state => state.block.blockHash);

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
  } else {
    title = (<>Loading FOMO Nouns...</>);
  }

  const style = usePickByState(
    classes.cool,
    classes.warm,
  );

  //TODO: set to `activeAuction` after dev work on PlayTitle
  return !activeAuction ? (
    <div className={classes.wrapper}>
      <h1 className={clsx(classes.title, style)}>
        {title}
      </h1>
    </div>
  ) : (<PlayTitle />);
};

export default Title;