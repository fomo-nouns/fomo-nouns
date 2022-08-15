import React from "react";
import classes from './BlockCountdownTimer.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAppSelector } from "../../hooks";
import clsx from "clsx";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import { default as config } from '../../config';

dayjs.extend(duration);

const voteTime = config.voteTime;

const BlockCountdownTimer: React.FC<{}> = props => {
  const voteTimeLeft = useAppSelector(state => state.vote.voteTimeLeft);

  let timeLeft = voteTimeLeft / voteTime * 100;

  const min = 1;
  timeLeft = timeLeft < min ? min : timeLeft;
  const max = 100;
  timeLeft = timeLeft > max ? max : timeLeft;

  const barStyle = {
    width: `${timeLeft}%`,
    transition: 'width 60ms ease-out'
  };

  const timerThreshold = timeLeft <= 20;

  const titleStyle = usePickByState(
    classes.Cool,
    classes.Warm,
  );

  return (
    <div className={classes.Wrapper}>
      <div className={clsx(classes.Title, titleStyle)}>Time To Vote</div>
      <div className={classes.BarOutline}>
        <div className={clsx(classes.ProgressBar, timerThreshold ? classes.Threshold : '')} style={barStyle} />
      </div>
    </div>
  )
};

export default BlockCountdownTimer;