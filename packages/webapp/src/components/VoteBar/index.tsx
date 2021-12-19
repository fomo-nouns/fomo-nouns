import VoteButton from '../VoteButton';
import { VOTE_OPTIONS } from '../../state/slices/vote';
import { useEffect } from 'react';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { openVoteSocket } from '../../middleware/voteWebsocket';
import { openEthereumSocket } from '../../middleware/alchemyWebsocket';


const VoteBar:React.FC<{}> = (props) => {
  const dispatch = useAppDispatch();
  const selectedVote = useAppSelector(state => state.vote.currentVote);
  const voteSocketConnected = useAppSelector(state => state.vote.connected);
  const ethereumSocketConnected = useAppSelector(state => state.block.connected);
  const votingActive = useAppSelector(state => state.vote.votingActive);

  const openSocket = () => {
    if (!voteSocketConnected) {
      dispatch(openVoteSocket());
    }
    if (!ethereumSocketConnected) {
      dispatch(openEthereumSocket());
    }    
  }

  useEffect(() => {
    console.log("vote changed to: ", selectedVote);
  }, [selectedVote]);

  const voteOpts = (neutralOption: boolean) => (
    <>
      <VoteButton voteType={VOTE_OPTIONS.voteDislike} />
      {neutralOption && <VoteButton voteType={VOTE_OPTIONS.voteShrug} />}
      <VoteButton voteType={VOTE_OPTIONS.voteLike} />
    </>
  );

  const reconnectOpt = (
    <span className={classes.reconnect} onClick={openSocket}>Click Here to Reconnect</span>
  );

  return(
    <div className={`${!votingActive ? classes.VoteBarOverlay : ''} ${classes.VoteBar}`}>
      { (voteSocketConnected && ethereumSocketConnected) ? voteOpts(false) : reconnectOpt }
    </div>
  );
}

export default VoteBar;