import React, { useEffect, useState } from "react";
import classes from './BlockTimer.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAppSelector } from "../../hooks";

dayjs.extend(duration);

const BlockTimer: React.FC<{}> = props => {
  const blockTime = useAppSelector(state => state.block.blockTime);

  const [blockDuration, setBlockDuration] = useState<number>(0);

  useEffect(() => {
    const timeSince = dayjs().valueOf() - blockTime;
    
    let timer = setTimeout(() => {
      setBlockDuration(timeSince);
    }, 20);
    return () => clearInterval(timer);
  }, [blockTime, blockDuration]);
  
  const timerDuration = dayjs.duration(blockDuration, 'ms');
  const seconds = Math.floor(timerDuration.seconds());

  return(
    <div className={`${classes.Wrapper}`}>
      Block Time: {seconds}s
    </div>
  )
};

export default BlockTimer;