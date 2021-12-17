import VoteButton from '../VoteButton';
import { VOTE_OPTIONS } from '../../state/slices/vote';
import { useEffect } from 'react';
import classes from './VoteBar.module.css';
import { useAppSelector } from '../../hooks';

const VoteBar:React.FC<{}> = (props) => {
  const activeVote = useAppSelector(state => state.vote.currentVote);
  useEffect(() => {
    console.log("vote changed to: ", activeVote);
  }, [activeVote]);

  const voteOpts = (
      <>
      <VoteButton voteType={VOTE_OPTIONS.voteDislike} />
      <VoteButton voteType={VOTE_OPTIONS.voteShrug} />
      <VoteButton voteType={VOTE_OPTIONS.voteLike} />
      </>
  );

  return(
    <div className={classes.VoteBar}>
      {voteOpts}  
    </div>
  );
    
}

export default VoteBar;