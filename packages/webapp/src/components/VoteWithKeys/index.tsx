import React, { useEffect } from "react";
import VoteButton from '../VoteButton';
import { VOTE_OPTIONS, setVotingBlockHash } from '../../state/slices/vote';
import classes from './VoteWithKeys.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { openVoteSocket } from '../../middleware/voteWebsocket';
import { openEthereumSocket } from '../../middleware/alchemyWebsocket';


const VoteWithKeys:React.FC<{}> = (props) => {
  const dispatch = useAppDispatch();
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const voteSocketConnected = useAppSelector(state => state.vote.connected);
  const ethereumSocketConnected = useAppSelector(state => state.block.connected);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const blockhash = useAppSelector(state => state.block.blockHash);

  // Approves a specific blockhash for voting after a period of time. This prevents the user from voting on a Noun by mistake as a new block is received.
//   useEffect( () => {
//     const timerId = setTimeout(dispatch, 500, setVotingBlockHash(blockhash));
//     return () => clearTimeout(timerId);
//   }, [blockhash, dispatch])

//   const openSocket = () => {
//     if (!voteSocketConnected) {
//       dispatch(openVoteSocket());
//     }
//     if (!ethereumSocketConnected) {
//       dispatch(openEthereumSocket());
//     }    
//   }

  return(
    <div className={classes.Wrapper}>
        <p>Vote with keys</p>
    </div>
  );
}

export default VoteWithKeys;