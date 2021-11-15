import VoteButton, { EMOJI_TYPE } from '../VoteButton';
import { useEffect } from 'react';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';

const VoteBar:React.FC<{ client: any }> = (props) => {
  const {client} = props;
  const activeVote = useAppSelector(state => state.vote.currentVote);
  useEffect(() => {
    console.log("vote changed to: ", activeVote);
  }, [activeVote]);

  const emojiVoteOpts = (
      <>
      <VoteButton emojiType={EMOJI_TYPE.hate} client={client}/>
      <VoteButton emojiType={EMOJI_TYPE.dislike} client={client}/>
      <VoteButton emojiType={EMOJI_TYPE.like} client={client}/>
      <VoteButton emojiType={EMOJI_TYPE.love} client={client}/>
      </>
  )

  return(
    <div className={classes.VoteBar}>
      {emojiVoteOpts}  
    </div>
  );
    
}

export default VoteBar;