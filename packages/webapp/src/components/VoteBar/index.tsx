import VoteButton from '../VoteButton';
import { VOTE_OPTIONS } from '../../state/slices/vote';
import { useEffect } from 'react';
import classes from './VoteBar.module.css';
import { useAppSelector } from '../../hooks';

const VoteBar:React.FC<{ client: any }> = (props) => {
  const {client} = props;
  const activeVote = useAppSelector(state => state.vote.currentVote);
  useEffect(() => {
    console.log("vote changed to: ", activeVote);
  }, [activeVote]);

  const voteOpts = (
      <>
      <VoteButton voteType={VOTE_OPTIONS.voteHate} client={client}/>
      <VoteButton voteType={VOTE_OPTIONS.voteDislike} client={client}/>
      <VoteButton voteType={VOTE_OPTIONS.voteLike} client={client}/>
      <VoteButton voteType={VOTE_OPTIONS.voteLove} client={client}/>
      </>
  )

  return(
    <div className={classes.VoteBar}>
      {voteOpts}  
    </div>
  );
    
}

export default VoteBar;