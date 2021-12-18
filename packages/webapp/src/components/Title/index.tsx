import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";

const activeAuctionCopy = `It's not Noun O'Clock yet
Come back in:`;
const gameActiveCopy = `Vote if we should mint this Noun!`;
const attemptSettlementCopy = `Attempting
to settle...`;

const Title: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);

  let titleText = '';
  if (activeAuction) {
    titleText = activeAuctionCopy;
  } else if (attemptedSettle) {
    titleText = attemptSettlementCopy;
  } else {
    titleText = gameActiveCopy;
  }

  return (
    <div className={classes.Wrapper}>
      <h1 className={classes.Title}>
        {titleText}
      </h1>
    </div>
  )
};

export default Title;