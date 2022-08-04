import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./PlayTitle.module.css";
import BlockCountdownTimer from '../BlockCountdownTimer';
import Gradient, { GradientStyle } from "../Gradient";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";
import { VOTE_OPTIONS } from "../../state/slices/vote";
import { yesVotesNeeded } from "../../utils/voteMath";

const PlayTitle: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
    const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
    const votingActive = useAppSelector(state => state.vote.votingActive);
    const activeVoters = useAppSelector(state => state.vote.activeVoters);
    const votes = useAppSelector(state => state.vote.voteCounts);

    const likes = votes[VOTE_OPTIONS.voteLike];
    const dislikes = votes[VOTE_OPTIONS.voteDislike];

    console.log(`total votes: ${likes + dislikes}`)
    console.log(`likes: ${likes}`)
    console.log(`dislikes: ${dislikes}`)

    let timerSpacer = (<div className={classes.timerSpacer}>&nbsp;</div>);

    let title = <></>;
    // TODO: set to `(attemptedSettle)` after dev work
    if (attemptedSettle) {
        title = (
            <>
                <Gradient style={GradientStyle.FUCHSIA_PURPLE}>Attempting to settle...</Gradient>
                <div>{timerSpacer}</div>
            </>
        );
        // TODO: set to `(votingActive)` after dev work
    } else if (votingActive) {
        const requiredLikes = yesVotesNeeded(dislikes, activeVoters);
        console.log(`required likes: ${requiredLikes}`)

        let titleText = ''
        if ((requiredLikes + dislikes) > activeVoters) {
            titleText = 'No way we can get this noun now';
        } else {
            if (likes === 0) {
                titleText = `${requiredLikes} yes votes and we'll mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}`;
            } else {
                const moreLikesNeeded = requiredLikes - likes > 0 ? requiredLikes - likes : 0;
                titleText = `${moreLikesNeeded} votes more and we'll mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}`;
            }
        }

        title = (
            <div>
                <Gradient style={GradientStyle.FUCHSIA_PURPLE}>{titleText}</Gradient>
                <BlockCountdownTimer />
            </div>
        );
        // TODO: set to `(!activeAuction && !votingActive)` after dev work
    } else if (activeAuction && !votingActive) {
        title = (
            <div>
                <div>Time's up! Waiting for next block...</div>
                <BlockCountdownTimer />
            </div>
        );
    } else {
        title = <></>
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

export default PlayTitle;