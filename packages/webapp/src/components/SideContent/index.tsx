import React from "react";
import { useAppSelector } from "../../hooks";
import auction from "../../state/slices/auction";
import classes from './SideContent.module.css';


const howToPlayCopy = `How to Play:
Every time a new block is created on the Ethereum network, the Noun that will be minted changes. The Noun you see displayed is the Noun that will be minted if the auction is settled in the current block. Simply select on the emoji that corresponds to how you feel about the Noun displayed and if there is emoji consensus, we will mint it.
`;

const activeAuctionCopy = `These Nouns will be lost to the Ether...forever.
Come back at Noun O'Clock to play!`;

const SideContent: React.FC<{content: string}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    return(
        <div className={classes.Wrapper}>
            <p className={classes.Copy}>
                {activeAuction && activeAuctionCopy}
                {!activeAuction && howToPlayCopy}
            </p>
        </div>
    )
};

export default SideContent;