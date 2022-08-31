import React, { useState } from "react";
import { useAppSelector } from "../../hooks";
import classes from "./PlayTitle.module.css";
import BlockCountdownTimer from '../BlockCountdownTimer';
import Gradient, { GradientStyle } from "../Gradient";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";
import { VOTE_OPTIONS } from "../../state/slices/vote";

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
    const votes = useAppSelector(state => state.vote.voteCounts);
    const requiredLikes = useAppSelector(state => state.vote.consensusRequiredLikes);
    const consensusUnreachable = useAppSelector(state => state.vote.consensusUnreachable);

    const [noWayWeGetItTitle, setNoWayWeGetItTitle] = useState<string | undefined>(undefined);

    const likes = votes[VOTE_OPTIONS.voteLike];

    let title = '';
    if (attemptedSettle) {
        title = randomSettleTitle()
    } else if (votingActive && consensusUnreachable) {
        if (noWayWeGetItTitle === undefined) {
            const randomNoWayTitle = randomNoWayWeGetItTitle();
            setNoWayWeGetItTitle(randomNoWayTitle);

            title = randomNoWayTitle;
        } else {
            title = noWayWeGetItTitle;
        }
    } else if (votingActive) {
        if (noWayWeGetItTitle !== undefined) {
            setNoWayWeGetItTitle(undefined);
        }

        if (likes === 0) {
            title = `${requiredLikes} yes votes and we'll mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}`;
        } else {
            const moreLikesNeeded = requiredLikes - likes > 0 ? requiredLikes - likes : 0;
            title = `${moreLikesNeeded} more votes and we'll mint ${nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}`;
        }
    } else if (!activeAuction && !votingActive) {
        if (noWayWeGetItTitle === undefined) {
            title = randomTimeIsUpTitle();
        } else {
            title = noWayWeGetItTitle;
        }
    } else {
        title = ''
    }

    const style = usePickByState(
        classes.cool,
        classes.warm,
    );

    return (
        <div className={classes.wrapper}>
            <h1 className={clsx(classes.title, style)}>
                {attemptedSettle
                    ? <Gradient style={GradientStyle.FUCHSIA_PURPLE}>{title}</Gradient>
                    : <div>{title}</div>}
                <BlockCountdownTimer />
            </h1>
        </div>
    )
};

export default PlayTitle;