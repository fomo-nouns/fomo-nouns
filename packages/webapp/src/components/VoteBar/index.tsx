import VoteButton, { EMOJI_TYPE } from '../VoteButton';
import { useEffect } from 'react';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';

const VoteBar = () => {
  const activeVote = useAppSelector(state => state.vote.currentVote);

  useEffect(() => {
    console.log("vote changed to: ", activeVote);
  }, [activeVote]);

  const emojiVoteOpts = (
      <>
      <VoteButton emojiType={EMOJI_TYPE.hate}/>
      <VoteButton emojiType={EMOJI_TYPE.dislike}/>
      <VoteButton emojiType={EMOJI_TYPE.like}/>
      <VoteButton emojiType={EMOJI_TYPE.love}/>
      </>
  )

  return(
    <div className={classes.VoteBar}>
      {emojiVoteOpts}  
    </div>
  );
    
}

export default VoteBar;