import clsx from 'clsx';
import classes from './VoteButton.module.css';
import { VOTE_OPTIONS, setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';


export enum EMOJI_TYPE {
    hate = '🤢',
    dislike = '👎',
    like = '👍',
    love = '😍',
}

const voteToEmoji: Record<VOTE_OPTIONS, string> = {
  [VOTE_OPTIONS['voteHate']]: '🤢',
  [VOTE_OPTIONS['voteDislike']]: '👎',
  [VOTE_OPTIONS['voteLike']]: '👍',
  [VOTE_OPTIONS['voteLove']]: '😍'
};

const VoteButton: React.FC<{voteType: VOTE_OPTIONS, client: any}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const activeVote = useAppSelector(state => state.vote.currentVote);
  const wsConnected = useAppSelector(state => state.websocket.connected);
  const hash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId);
  const voteCounts = useAppSelector(state => state.vote.voteCounts);

  const { voteType, client } = props;
  const dispatch = useAppDispatch();
  const changeVote = () => {
    if (activeVote) return;
    
    dispatch(setCurrentVote(voteType));
    if (wsConnected){
      console.log(voteType);
      const voteMsg = {"action": "sendvote", "nounId": nextNounId, "blockhash": hash, "vote": voteType};
      client.send(JSON.stringify(voteMsg));
    }
  }

  return (
      <button className={activeVote === voteType ? clsx(classes.voteButton, classes.selected) : classes.voteButton} onClick={changeVote}
      disabled={activeAuction}>
        <p className={classes.voteEmojiText}> {voteToEmoji[voteType]} </p>
        <p className={classes.voteText}> {voteCounts[voteType]} </p>
      </button>
  );
};
  export default VoteButton;