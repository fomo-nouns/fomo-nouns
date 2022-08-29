import React, { useEffect } from "react";
import VoteButton from '../VoteButton';
import { VOTE_OPTIONS, setVotingBlockHash } from '../../state/slices/vote';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { openVoteSocket } from '../../middleware/voteWebsocket';
import { openEthereumSocket } from '../../middleware/alchemyWebsocket';
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";

const waitTexts = [
  `While we wait, let’s watch perfect nouns pass by...`,
  `It might have been the one, but it's not the play time yet...`
]

const getRandomWaitText = () => {
  return waitTexts[Math.floor(Math.random() * waitTexts.length)]
}

const VoteBar: React.FC<{}> = (props) => {
  const dispatch = useAppDispatch();
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const voteSocketConnected = useAppSelector(state => state.vote.connected);
  const ethereumSocketConnected = useAppSelector(state => state.block.connected);
  const blockhash = useAppSelector(state => state.block.blockHash);

  // Approves a specific blockhash for voting after a period of time. This prevents the user from voting on a Noun by mistake as a new block is received.
  useEffect(() => {
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

  const waitText = (
    <div className={classes.waitText}>
      {getRandomWaitText()}
    </div>
  );

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

  let elements = <></>

  if (activeAuction) {
    elements = waitText;
  } else if (voteSocketConnected && ethereumSocketConnected) {
    elements = voteOpts(false);
  } else if (!ethereumSocketConnected) {
    elements = reconnectOpt;
  } else {
    elements = voteReconnectOpt;
  }

  const style = usePickByState(classes.cool, classes.warm)

  return (
    <div className={clsx(classes.VoteBar, style)}
    >
      {elements}
    </div>
  );
}

export default VoteBar;