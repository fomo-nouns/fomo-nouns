import clsx from 'clsx';
import classes from './VoteButton.module.css';
import { VOTE_OPTIONS, setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendVote } from '../../middleware/voteWebsocket';
import useEventListener from '@use-it/event-listener';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';

const solidThumbsUp = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
  </svg>
)

const solidThumbsDown = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
  </svg>
)

const outlineThumbsUp = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
)

const outlineThumbsDown = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
  </svg>
)

const voteToKey: Record<VOTE_OPTIONS, string> = {
  [VOTE_OPTIONS.voteDislike]: 'ArrowLeft',
  [VOTE_OPTIONS.voteShrug]: '-100',
  [VOTE_OPTIONS.voteLike]: 'ArrowRight'
};

const voteToSolidThumb: Record<VOTE_OPTIONS, JSX.Element> = {
  [VOTE_OPTIONS.voteDislike]: solidThumbsDown,
  [VOTE_OPTIONS.voteShrug]: <></>,
  [VOTE_OPTIONS.voteLike]: solidThumbsUp,
};

const voteToOutlineThumb: Record<VOTE_OPTIONS, JSX.Element> = {
  [VOTE_OPTIONS.voteDislike]: outlineThumbsDown,
  [VOTE_OPTIONS.voteShrug]: <></>,
  [VOTE_OPTIONS.voteLike]: outlineThumbsUp,
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

  const currentVoteButton = currentVote === voteType;

  return (
    <button className={clsx(classes.voteButton, style, currentVoteButton ? classes.selected : '')}
      onClick={() => changeVote(voteType)}
      //TODO: dev - set disabled back to `disabled={disabled}`
      disabled={!disabled}>
      <div className={currentVoteButton ? classes.thumbBoxSelected : classes.thumbBox}>
        {currentVoteButton ? voteToSolidThumb[voteType] : voteToOutlineThumb[voteType]}
      </div>
      <span className={classes.voteText}> {voteCounts[voteType]} </span>
    </button>
  );
};

export default VoteButton;