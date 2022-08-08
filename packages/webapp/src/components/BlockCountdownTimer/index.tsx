import React, { useEffect, useState } from "react";
import classes from './BlockCountdownTimer.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAppDispatch, useAppSelector } from "../../hooks";
import { endVoting } from '../../state/slices/vote';
import clsx from "clsx";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";

dayjs.extend(duration);

const voteTime = 6000;

const BlockCountdownTimer: React.FC<{}> = props => {
  const dispatch = useAppDispatch();
  const blockTime = useAppSelector(state => state.block.blockTime);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timeSince = dayjs().valueOf() - blockTime;
    const timeLeft = voteTime - timeSince;

    if (timeLeft <= 0) {
      setTimeLeft(0);
      dispatch(endVoting());
    } else {
      let timer = setTimeout(() => {
        setTimeLeft(timeLeft - 20);
      }, 20);
      return () => clearInterval(timer);
    }
  }, [dispatch, blockTime, timeLeft]);

  let score = timeLeft / voteTime * 100;

  const min = 1;
  score = score < min ? min : score;
  const max = 100;
  score = score > max ? max : score;

  const barStyle = {
    width: `${score}%`,
    transition: 'width .15s ease-out'
  };

  const timerThreshold = score <= 20;

  const titleStyle = usePickByState(
    classes.Cool,
    classes.Warm,
  );

  return (
    <div className={classes.Wrapper}>
      <div className={clsx(classes.Title, titleStyle)}>Time Left</div>
      <div className={classes.BarOutline}>
        <div className={clsx(classes.ProgressBar, timerThreshold ? classes.Threshold : '')} style={barStyle} />
      </div>
    </div>
  )
};

export default BlockCountdownTimer;