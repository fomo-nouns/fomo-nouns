import React from "react";
import classes from './SideContent.module.css';


const howToPlayCopy = `How to Play:
FOMO Nouns allows the community to colletively decicde the next Noun. Every time a new block is created on the Ethereum network, the noun that will be minted changes. The noun you see displayed is the Noun that will be minted if the auction is settled in the current block. Simply select on the emoji that corresponds to how you feel about the Noun displayed and if there is emoji consensus, we will mint it.
`;

const SideContent: React.FC<{content: string}> = props => {
    const { content } = props;
    return(
        <div className={classes.Wrapper}>
            <p className={classes.Copy}>
                {howToPlayCopy}
            </p>
        </div>
    )
};

export default SideContent;