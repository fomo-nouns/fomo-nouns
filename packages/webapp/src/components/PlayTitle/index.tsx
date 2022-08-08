import React, { useState } from "react";
import { useAppSelector } from "../../hooks";
import classes from "./PlayTitle.module.css";
import BlockCountdownTimer from '../BlockCountdownTimer';
import Gradient, { GradientStyle } from "../Gradient";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";
import { VOTE_OPTIONS } from "../../state/slices/vote";
import { yesVotesNeeded } from "../../utils/voteMath";

const settleTitles = [
    `Trying to get this noun...`,
    `Attempting to settle...`,
    `Running to get it...`
]

const randomSettleTitle = () => {
    return settleTitles[Math.floor(Math.random() * settleTitles.length)]
}

const timeIsUpTitles = [
    `Time is up! Waiting for the next block...`,
    `Time is up! What was wrong with this one?`,
    `Time is up! It might have been the one, but it will not`
]

const randomTimeIsUpTitle = () => {
    return timeIsUpTitles[Math.floor(Math.random() * timeIsUpTitles.length)]
}

const noWayWeGetItTitles = [
    `RIP this one. What was wrong with it?`,
    `No way we get it now. Waiting for the next block...`,
    `Yeah, you don't want this one. To the next block...`
]

const randomNoWayWeGetItTitle = () => {
    return noWayWeGetItTitles[Math.floor(Math.random() * noWayWeGetItTitles.length)]
}

const PlayTitle: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
    const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
    const votingActive = useAppSelector(state => state.vote.votingActive);
    const activeVoters = useAppSelector(state => state.vote.activeVoters);
    const votes = useAppSelector(state => state.vote.voteCounts);

    const [noWayWeGetItTitle, setNoWayWeGetItTitle] = useState<string | undefined>(undefined);

    const likes = votes[VOTE_OPTIONS.voteLike];
    const dislikes = votes[VOTE_OPTIONS.voteDislike];

    let timerSpacer = (<div className={classes.timerSpacer}>&nbsp;</div>);

    let title = <></>;
    // TODO: set to `(attemptedSettle)` after dev work
    if (attemptedSettle) {
        title = (
            <>
                <Gradient style={GradientStyle.FUCHSIA_PURPLE}>{randomSettleTitle()}</Gradient>
                <div>{timerSpacer}</div>
            </>
        );
        // TODO: set to `(votingActive)` after dev work
    } else if (votingActive) {
        const requiredLikes = yesVotesNeeded(dislikes, activeVoters);

        let titleText = ''
        if ((requiredLikes + dislikes) > activeVoters) {
            if (noWayWeGetItTitle === undefined) {
                const randomNoWayTitle = randomNoWayWeGetItTitle();
                setNoWayWeGetItTitle(randomNoWayTitle);

                titleText = randomNoWayTitle;
            } else {
                titleText = noWayWeGetItTitle;
            }

            title = (
                <div>
                    <div>{titleText}</div>
                    <div>{timerSpacer}</div>
                </div>
            );
        } else {
            if (noWayWeGetItTitle !== undefined) {
                setNoWayWeGetItTitle(undefined);
            }

            if (likes === 0) {
                titleText = `${requiredLikes} yes votes and we'll mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}`;
            } else {
                const moreLikesNeeded = requiredLikes - likes > 0 ? requiredLikes - likes : 0;
                titleText = `${moreLikesNeeded} more votes and we'll mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}`;
            }

            title = (
                <div>
                    <div>{titleText}</div>
                    <BlockCountdownTimer />
                </div>
            );
        }
        // TODO: set to `(!activeAuction && !votingActive)` after dev work
    } else if (activeAuction && !votingActive) {
        if (noWayWeGetItTitle === undefined) {
            title = (
                <div>
                    <div>{randomTimeIsUpTitle()}</div>
                    <BlockCountdownTimer />
                </div>
            );
        } else {
            title = (
                <div>
                    <div>{noWayWeGetItTitle}</div>
                    <div>{timerSpacer}</div>
                </div>
            );
        }
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