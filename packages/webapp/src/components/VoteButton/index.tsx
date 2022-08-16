import clsx from 'clsx';
import classes from './VoteButton.module.css';
import { VOTE_OPTIONS, setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendVote } from '../../middleware/voteWebsocket';
import useEventListener from '@use-it/event-listener';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';

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

const voteToKey: Record<VOTE_OPTIONS, string> = {
  [VOTE_OPTIONS.voteDislike]: 'ArrowLeft',
  [VOTE_OPTIONS.voteShrug]: '-100',
  [VOTE_OPTIONS.voteLike]: 'ArrowRight'
};

const VoteButton: React.FC<{ voteType: VOTE_OPTIONS }> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const currentVote = useAppSelector(state => state.vote.currentVote);
  const wsConnected = useAppSelector(state => state.vote.connected);
  const blockHash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId);
  const voteCounts = useAppSelector(state => state.vote.voteCounts);
  const votingBlockHash = useAppSelector(state => state.vote.votingBlockHash);

  const votingActive = useAppSelector(state => state.vote.votingActive);

  const { voteType } = props;
  const voteNotSelected = (currentVote !== undefined) && currentVote !== voteType;
  const dispatch = useAppDispatch();

  const changeVote = (voteType: VOTE_OPTIONS) => {
    if (currentVote || !wsConnected) return;

    dispatch(setCurrentVote(voteType));
    dispatch(sendVote({ "nounId": nextNounId, "blockhash": blockHash, "vote": voteType }));
  }

  const disabled = voteNotSelected || (!votingActive || activeAuction) || blockHash !== votingBlockHash

  useEventListener("keydown", (key) => {
    const event = key as KeyboardEvent

    if (event.key === voteToKey[voteType] && !disabled) {
      changeVote(voteType);
    }
  });

  const style = usePickByState(
    classes.cool,
    classes.warm
  )

  return (
    <button className={clsx(classes.voteButton, style, currentVote === voteType ? classes.selected : '')}
      onClick={() => changeVote(voteType)}
      //TODO: dev - set disabled back to `disabled={disabled}`
      disabled={!disabled}>
      <span className={classes.voteEmojiText}> {voteToEmoji[voteType]} </span>
      <span className={classes.voteText}> {voteCounts[voteType]} </span>
    </button>
  );
};

export default VoteButton;