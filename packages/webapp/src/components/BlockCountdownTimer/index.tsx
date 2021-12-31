import React, { useEffect, useState } from "react";
import classes from './BlockCountdownTimer.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAppDispatch, useAppSelector } from "../../hooks";
import { endVoting } from '../../state/slices/vote';

dayjs.extend(duration);

const BlockCountdownTimer: React.FC<{}> = props => {
  const dispatch = useAppDispatch();
  const blockTime = useAppSelector(state => state.block.blockTime);
  const votingActive = useAppSelector(state => state.vote.votingActive);

  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const timeSince = dayjs().valueOf() - blockTime;
    const timeLeft = 6000 - timeSince;
    
    if(timeLeft <= 0) {
      setTimeLeft(0);
      dispatch(endVoting());
    } else {
      let timer = setTimeout(() => {
        setTimeLeft(timeLeft - 20);
      }, 20);
      return () => clearInterval(timer);
    }
  }, [dispatch, blockTime, timeLeft]);
  
  const timerDuration = dayjs.duration(timeLeft, 'ms');
  const seconds = Math.floor(timerDuration.seconds());
  const ms = Math.floor(timerDuration.milliseconds() / 10);
  
  const timerThreshold = seconds <= 1;

  return(
    <div className={`${classes.Wrapper} ${votingActive ? classes.ActiveVote : ''} 
    ${timerThreshold ? classes.Threshold: ''}`}>
      {seconds}.{ms}
    </div>
  )
};

export default BlockCountdownTimer;