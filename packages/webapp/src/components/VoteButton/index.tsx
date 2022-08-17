import clsx from 'clsx';
import classes from './VoteButton.module.css';
import { VOTE_OPTIONS, setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendVote } from '../../middleware/voteWebsocket';
import useEventListener from '@use-it/event-listener';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';

const solidThumbsUp = (
  <svg className={classes.thumbSelected} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10.5C2 10.303 2.0388 10.108 2.11418 9.92597C2.18956 9.74399 2.30005 9.57863 2.43934 9.43934C2.57863 9.30005 2.74399 9.18956 2.92597 9.11418C3.10796 9.0388 3.30302 9 3.5 9C3.69698 9 3.89204 9.0388 4.07403 9.11418C4.25601 9.18956 4.42137 9.30005 4.56066 9.43934C4.69995 9.57863 4.81044 9.74399 4.88582 9.92597C4.9612 10.108 5 10.303 5 10.5V16.5C5 16.8978 4.84196 17.2794 4.56066 17.5607C4.27936 17.842 3.89782 18 3.5 18C3.10218 18 2.72064 17.842 2.43934 17.5607C2.15804 17.2794 2 16.8978 2 16.5V10.5ZM6 10.333V15.763C5.99983 16.1347 6.10322 16.499 6.29858 16.8152C6.49394 17.1314 6.77353 17.3869 7.106 17.553L7.156 17.578C7.71089 17.8553 8.32267 17.9998 8.943 18H14.359C14.8215 18.0002 15.2698 17.84 15.6276 17.5469C15.9853 17.2537 16.2303 16.8456 16.321 16.392L17.521 10.392C17.579 10.1019 17.5719 9.80249 17.5002 9.51544C17.4285 9.22839 17.294 8.96082 17.1065 8.73201C16.9189 8.50321 16.6829 8.31887 16.4155 8.19229C16.148 8.0657 15.8559 8.00003 15.56 8H12V4C12 3.46957 11.7893 2.96086 11.4142 2.58579C11.0391 2.21071 10.5304 2 10 2C9.73478 2 9.48043 2.10536 9.29289 2.29289C9.10536 2.48043 9 2.73478 9 3V3.667C9 4.53248 8.71929 5.37462 8.2 6.067L6.8 7.933C6.28071 8.62538 6 9.46752 6 10.333V10.333Z" fill="url(#paint0_linear_808_7250)" />
    <defs>
      <linearGradient id="paint0_linear_808_7250" x1="19.5" y1="2" x2="2" y2="18" gradientUnits="userSpaceOnUse">
        <stop stop-color="#02EC6E" />
        <stop offset="1" stop-color="#08DDEA" />
      </linearGradient>
    </defs>
  </svg>
)

const solidThumbsDown = (
  <svg className={classes.thumbSelected} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 9.5C18 9.89783 17.842 10.2794 17.5607 10.5607C17.2794 10.842 16.8978 11 16.5 11C16.1022 11 15.7206 10.842 15.4393 10.5607C15.158 10.2794 15 9.89783 15 9.5V3.5C15 3.10218 15.158 2.72064 15.4393 2.43934C15.7206 2.15804 16.1022 2 16.5 2C16.8978 2 17.2794 2.15804 17.5607 2.43934C17.842 2.72064 18 3.10218 18 3.5V9.5ZM14 9.667V4.237C14.0003 3.86544 13.897 3.50116 13.7018 3.18499C13.5067 2.86882 13.2273 2.61327 12.895 2.447L12.845 2.422C12.2892 2.14422 11.6763 1.99973 11.055 2H5.64C5.17747 1.99982 4.72918 2.15995 4.37145 2.45314C4.01371 2.74633 3.76866 3.15444 3.678 3.608L2.478 9.608C2.41999 9.89821 2.42712 10.1977 2.49886 10.4848C2.5706 10.7719 2.70516 11.0396 2.89285 11.2684C3.08054 11.4972 3.31667 11.6815 3.58422 11.808C3.85176 11.9346 4.14405 12.0001 4.44 12H8V16C8 16.5304 8.21072 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V16.333C11 15.4675 11.2807 14.6254 11.8 13.933L13.2 12.067C13.7193 11.3746 14 10.5325 14 9.667V9.667Z" fill="url(#paint0_linear_810_7252)" />
    <defs>
      <linearGradient id="paint0_linear_810_7252" x1="2" y1="18" x2="19" y2="1.8941e-06" gradientUnits="userSpaceOnUse">
        <stop stop-color="#D400CC" />
        <stop offset="1" stop-color="#FF3131" />
      </linearGradient>
    </defs>
  </svg>

)

const outlineThumbsUp = (
  <svg className={classes.thumb} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
)

const outlineThumbsDown = (
  <svg className={classes.thumb} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} xmlns="http://www.w3.org/2000/svg">
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

const voteToGradientStyle: Record<VOTE_OPTIONS, string> = {
  [VOTE_OPTIONS.voteDislike]: classes.negative,
  [VOTE_OPTIONS.voteShrug]: '',
  [VOTE_OPTIONS.voteLike]: classes.positive,
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
  // const disabled = voteNotSelected || (!votingActive) || blockHash !== votingBlockHash

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
    <button className={classes.voteButton}
      onClick={() => changeVote(voteType)}
      //TODO: dev - set disabled back to `disabled={disabled}`
      disabled={!disabled}>
      <div className={
        clsx(
          style, voteToGradientStyle[voteType],
          currentVoteButton ? classes.selected : '',
          //TODO: dev - set disabled back to `disabled ? ...`
          !disabled ? classes.disabled : ''
        )
      }>
        <div className={clsx(style, classes.dataBox)}>
          <div className={currentVoteButton ? classes.thumbBoxSelected : classes.thumbBox}>
            {currentVoteButton ? voteToSolidThumb[voteType] : voteToOutlineThumb[voteType]}
          </div>
          <span className={classes.voteText}> {voteCounts[voteType]} </span>
        </div>
      </div>
    </button>
  );
};

export default VoteButton;