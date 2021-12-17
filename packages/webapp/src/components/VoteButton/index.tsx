import clsx from 'clsx';
import classes from './VoteButton.module.css';
import { VOTE_OPTIONS, setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendVote } from '../../middleware/voteWebsocket';

export enum EMOJI_TYPE {
    dislike = '👎',
    shrug = '🤷‍♂️',
    like = '👍'
}

const voteToEmoji: Record<VOTE_OPTIONS, string> = {
  [VOTE_OPTIONS['voteDislike']]: '👎',
  [VOTE_OPTIONS['voteShrug']]: '🤷‍♂️',
  [VOTE_OPTIONS['voteLike']]: '👍'
};

const VoteButton: React.FC<{voteType: VOTE_OPTIONS}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const activeVote = useAppSelector(state => state.vote.currentVote);
  const wsConnected = useAppSelector(state => state.websocket.connected);
  const hash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId);
  const voteCounts = useAppSelector(state => state.vote.voteCounts);

  const { voteType } = props;
  const dispatch = useAppDispatch();
  const changeVote = () => {
    if (activeVote) return;
    
    dispatch(setCurrentVote(voteType));
    if (wsConnected){
      console.log(voteType);
      dispatch(sendVote({"nounId": nextNounId, "blockhash": hash, "vote": voteType}));
    }
  }

  return (
      <button className={activeVote === voteType ? clsx(classes.voteButton, classes.selected) : classes.voteButton} onClick={changeVote}
      disabled={activeAuction}>
        <span className={classes.voteEmojiText}> {voteToEmoji[voteType]} </span>
        <span className={classes.voteText}> {voteCounts[voteType]} </span>
      </button>
  );
};
  export default VoteButton;