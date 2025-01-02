import React, { useEffect, useState } from "react";
import VoteButton from '../VoteButton';
import { VOTE_OPTIONS, setVotingBlockHash } from '../../state/slices/vote';
import classes from './VoteBar.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { openVoteSocket } from '../../middleware/voteWebsocket';
import { openEthereumSocket } from '../../middleware/alchemyWebsocket';
import WalletConnectModal from '../WalletConnectModal';
import { useEthers } from '@usedapp/core';
import { createSignatureMessage } from '../../utils/signature';
import { setAuthData } from '../../state/slices/auth';

const VoteBar: React.FC<{}> = (props) => {
  const dispatch = useAppDispatch();
  const { account, library } = useEthers();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const voteSocketConnected = useAppSelector(state => state.vote.connected);
  const ethereumSocketConnected = useAppSelector(state => state.block.connected);
  const votingActive = useAppSelector(state => state.vote.votingActive);
  const blockhash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId);
  const authData = useAppSelector(state => state.auth);

  // Approves a specific blockhash for voting after a period of time. This prevents the user from voting on a Noun by mistake as a new block is received.
  useEffect(() => {
    const timerId = setTimeout(dispatch, 500, setVotingBlockHash(blockhash));
    return () => clearTimeout(timerId);
  }, [blockhash, dispatch]);

  const requestSignature = async () => {
    try {
      if (!account || !library || !nextNounId) return;
      const signer = library.getSigner();
      const message = createSignatureMessage(account, nextNounId.toString());
      const signature = await signer.signMessage(message);

      dispatch(setAuthData({
        signature,
        address: account.toLowerCase(),
        nounId: nextNounId.toString()
      }));

      // Open sockets after signature
      if (!voteSocketConnected) {
        dispatch(openVoteSocket());
      }
      if (!ethereumSocketConnected) {
        dispatch(openEthereumSocket());
      }
    } catch (error) {
      console.error('Error getting signature:', error);
    }
  };

  const openSocket = async () => {
    if (!account) {
      setShowWalletModal(true);
      return;
    }

    if (!authData.signature) {
      await requestSignature();
      return;
    }

    if (!voteSocketConnected) {
      dispatch(openVoteSocket());
    }
    if (!ethereumSocketConnected) {
      dispatch(openEthereumSocket());
    }
  };

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
  );

  return (
    <>
      <div className={`
        ${(!votingActive || activeAuction === undefined) ? classes.VoteBarOverlay : ''}
        ${classes.VoteBar}`}
      >
        {(voteSocketConnected && ethereumSocketConnected) ? voteOpts(false)
          : !ethereumSocketConnected ? reconnectOpt
            : voteReconnectOpt}
      </div>
      {showWalletModal && (
        <WalletConnectModal
          onClose={() => setShowWalletModal(false)}
          requireSignature={true}
        />
      )}
    </>
  );
};

export default VoteBar;