import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./Title.module.css";

const activeAuctionCopy = `It's not Noun O'Clock yet
Come back in:`;
const gameActiveCopy = `FOMO Nouns
Should we mint this Noun?`;

const Title: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    return (
        <div className={classes.Wrapper}>
            {activeAuction && <h1 className={classes.Title}>{activeAuctionCopy}</h1>}
            {!activeAuction && <h1 className={classes.Title}>{gameActiveCopy}</h1>}
        </div>
    )

};

export default Title;