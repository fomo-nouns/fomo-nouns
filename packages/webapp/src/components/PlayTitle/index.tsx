import React from "react";
import { useAppSelector } from "../../hooks";
import classes from "./PlayTitle.module.css";
import BlockCountdownTimer from '../BlockCountdownTimer';
import Gradient, { GradientStyle } from "../Gradient";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";

const PlayTitle: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    const attemptedSettle = useAppSelector(state => state.vote.attemptedSettle);
    const votingActive = useAppSelector(state => state.vote.votingActive);
    const nextNounId = useAppSelector(state => state.noun.nextNounId)!;

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
        title = (
            <div>
                <div>Should we mint {nextNounId % 10 === 0 ? 'these Nouns' : 'this Noun'}?</div>
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