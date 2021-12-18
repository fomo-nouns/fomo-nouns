import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";

const activeAuctionCopy = `It's not Noun O'Clock yet
Come back in:`;
const gameActiveCopy = `Should we mint this Noun?`;
const attemptSettlementCopy = `Attempting
to settle...`;
// const successCopy = `We minted a Noun!`;
// const otherSettledCopy = `Someone else minted a Noun`;

const Title: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
    return (
        <div className={classes.Wrapper}>
            {activeAuction && <h1 className={classes.Title}>{activeAuctionCopy}</h1>}
            {!activeAuction && !attemptedSettle && <h1 className={classes.Title}>{gameActiveCopy}</h1>}
            {attemptedSettle && <h1 className={classes.Title}>{attemptSettlementCopy}</h1>}
        </div>
    )

};

export default Title;