import React, { useEffect } from "react";
import VoteButton from '../VoteButton';
import { VOTE_OPTIONS, setVotingBlockHash } from '../../state/slices/vote';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { openVoteSocket } from '../../middleware/voteWebsocket';
import { openEthereumSocket } from '../../middleware/alchemyWebsocket';


const VoteBar:React.FC<{}> = (props) => {
  const dispatch = useAppDispatch();
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const voteSocketConnected = useAppSelector(state => state.vote.connected);
  const ethereumSocketConnected = useAppSelector(state => state.block.connected);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const blockhash = useAppSelector(state => state.block.blockHash);

  // Approves a specific blockhash for voting after a period of time. This prevents the user from voting on a Noun by mistake as a new block is received.
  useEffect( () => {
    const timerId = setTimeout(dispatch, 500, setVotingBlockHash(blockhash));
    return () => clearTimeout(timerId);
  }, [blockhash, dispatch])

  const openSocket = () => {
    if (!voteSocketConnected) {
      dispatch(openVoteSocket());
    }
    if (!ethereumSocketConnected) {
      dispatch(openEthereumSocket());
    }    
  }

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

  const voteReconnectOpt = (
    <span className={classes.reconnect} onClick={openSocket}>Click to Enable Voting</span>
  )

  return(
    <div className={`
      ${(!votingActive || activeAuction === undefined) ? classes.VoteBarOverlay : ''}
      ${classes.VoteBar}`}
    >
      { (voteSocketConnected && ethereumSocketConnected) ? voteOpts(false)
        : !ethereumSocketConnected ? reconnectOpt
        : voteReconnectOpt }
    </div>
  );
}

export default VoteBar;