import VoteButton from '../VoteButton';
import { VOTE_OPTIONS } from '../../state/slices/vote';
import { useEffect } from 'react';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { openVoteSocket } from '../../middleware/voteWebsocket';


const VoteBar:React.FC<{}> = (props) => {
  const dispatch = useAppDispatch();
  const selectedVote = useAppSelector(state => state.vote.currentVote);
  const wsConnected = useAppSelector(state => state.vote.connected);
  const votingActive = useAppSelector(state => state.vote.votingActive);

  const openSocket = () => dispatch(openVoteSocket());

  useEffect(() => {
    console.log("vote changed to: ", selectedVote);
  }, [selectedVote]);

  const voteOpts = (
    <>
      <VoteButton voteType={VOTE_OPTIONS.voteDislike} />
      <VoteButton voteType={VOTE_OPTIONS.voteShrug} />
      <VoteButton voteType={VOTE_OPTIONS.voteLike} />
    </>
  );

  const reconnectOpt = (
    <span className={classes.reconnect} onClick={openSocket}>Click Here to Reconnect</span>
  );

  return(
    <div className={`${!votingActive ? classes.VoteBarOverlay : ''} ${classes.VoteBar}`}>
      { wsConnected ? voteOpts : reconnectOpt }
    </div>
  );
}

export default VoteBar;