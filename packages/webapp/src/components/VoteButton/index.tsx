import clsx from 'clsx';
import classes from './VoteButton.module.css';
import { VOTE_OPTIONS, setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { sendVote } from '../../middleware/voteWebsocket';
import useEventListener from '@use-it/event-listener';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';

function getThumbIcon(style: string, voteType: VOTE_OPTIONS, currentVoteButton: boolean): JSX.Element {
  if (voteType === VOTE_OPTIONS.voteLike) {
    if (currentVoteButton) {
      return (
        <svg className={classes.thumbSelected} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 10.5C2 10.303 2.0388 10.108 2.11418 9.92597C2.18956 9.74399 2.30005 9.57863 2.43934 9.43934C2.57863 9.30005 2.74399 9.18956 2.92597 9.11418C3.10796 9.0388 3.30302 9 3.5 9C3.69698 9 3.89204 9.0388 4.07403 9.11418C4.25601 9.18956 4.42137 9.30005 4.56066 9.43934C4.69995 9.57863 4.81044 9.74399 4.88582 9.92597C4.9612 10.108 5 10.303 5 10.5V16.5C5 16.8978 4.84196 17.2794 4.56066 17.5607C4.27936 17.842 3.89782 18 3.5 18C3.10218 18 2.72064 17.842 2.43934 17.5607C2.15804 17.2794 2 16.8978 2 16.5V10.5ZM6 10.333V15.763C5.99983 16.1347 6.10322 16.499 6.29858 16.8152C6.49394 17.1314 6.77353 17.3869 7.106 17.553L7.156 17.578C7.71089 17.8553 8.32267 17.9998 8.943 18H14.359C14.8215 18.0002 15.2698 17.84 15.6276 17.5469C15.9853 17.2537 16.2303 16.8456 16.321 16.392L17.521 10.392C17.579 10.1019 17.5719 9.80249 17.5002 9.51544C17.4285 9.22839 17.294 8.96082 17.1065 8.73201C16.9189 8.50321 16.6829 8.31887 16.4155 8.19229C16.148 8.0657 15.8559 8.00003 15.56 8H12V4C12 3.46957 11.7893 2.96086 11.4142 2.58579C11.0391 2.21071 10.5304 2 10 2C9.73478 2 9.48043 2.10536 9.29289 2.29289C9.10536 2.48043 9 2.73478 9 3V3.667C9 4.53248 8.71929 5.37462 8.2 6.067L6.8 7.933C6.28071 8.62538 6 9.46752 6 10.333V10.333Z" fill="url(#paint0_linear_808_7250)" />
          <defs>
            <linearGradient id="paint0_linear_808_7250" x1="19.5" y1="2" x2="2" y2="18" gradientUnits="userSpaceOnUse">
              <stop className={classes.thumbSelectedPositiveStopTop} />
              <stop className={classes.thumbSelectedPositiveStopBottom} offset="1" />
            </linearGradient>
          </defs>
        </svg>
      )
    } else {
      return (
        <svg className={classes.thumb} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 10H18.764C19.1049 10 19.4401 10.0871 19.7378 10.2531C20.0355 10.4191 20.2859 10.6584 20.4651 10.9484C20.6444 11.2383 20.7465 11.5692 20.7619 11.9098C20.7773 12.2503 20.7054 12.5891 20.553 12.894L17.053 19.894C16.8869 20.2265 16.6314 20.5061 16.3152 20.7014C15.999 20.8968 15.6347 21.0002 15.263 21H11.246C11.083 21 10.92 20.98 10.761 20.94L7 20M14 10V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H11.905C11.405 3 11 3.405 11 3.905C11 4.619 10.789 5.317 10.392 5.911L7 11V20M14 10H12M7 20H5C4.46957 20 3.96086 19.7893 3.58579 19.4142C3.21071 19.0391 3 18.5304 3 18V12C3 11.4696 3.21071 10.9609 3.58579 10.5858C3.96086 10.2107 4.46957 10 5 10H7.5" stroke="url(#paint0_linear_814_7256)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <defs>
            <linearGradient id="paint0_linear_814_7256" x1="23" y1="1" x2="0.500001" y2="22.5" gradientUnits="userSpaceOnUse">
              <stop className={clsx(style, classes.thumbPositiveStopTop)} />
              <stop className={clsx(style, classes.thumbPositiveStopBottom)} offset="1" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  } else if (voteType === VOTE_OPTIONS.voteDislike) {
    if (currentVoteButton) {
      return (
        <svg className={classes.thumbSelected} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 9.5C18 9.89783 17.842 10.2794 17.5607 10.5607C17.2794 10.842 16.8978 11 16.5 11C16.1022 11 15.7206 10.842 15.4393 10.5607C15.158 10.2794 15 9.89783 15 9.5V3.5C15 3.10218 15.158 2.72064 15.4393 2.43934C15.7206 2.15804 16.1022 2 16.5 2C16.8978 2 17.2794 2.15804 17.5607 2.43934C17.842 2.72064 18 3.10218 18 3.5V9.5ZM14 9.667V4.237C14.0003 3.86544 13.897 3.50116 13.7018 3.18499C13.5067 2.86882 13.2273 2.61327 12.895 2.447L12.845 2.422C12.2892 2.14422 11.6763 1.99973 11.055 2H5.64C5.17747 1.99982 4.72918 2.15995 4.37145 2.45314C4.01371 2.74633 3.76866 3.15444 3.678 3.608L2.478 9.608C2.41999 9.89821 2.42712 10.1977 2.49886 10.4848C2.5706 10.7719 2.70516 11.0396 2.89285 11.2684C3.08054 11.4972 3.31667 11.6815 3.58422 11.808C3.85176 11.9346 4.14405 12.0001 4.44 12H8V16C8 16.5304 8.21072 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18C10.2652 18 10.5196 17.8946 10.7071 17.7071C10.8946 17.5196 11 17.2652 11 17V16.333C11 15.4675 11.2807 14.6254 11.8 13.933L13.2 12.067C13.7193 11.3746 14 10.5325 14 9.667V9.667Z" fill="url(#paint0_linear_810_7252)" />
          <defs>
            <linearGradient id="paint0_linear_810_7252" x1="2" y1="18" x2="19" y2="1.8941e-06" gradientUnits="userSpaceOnUse">
              <stop className={classes.thumbSelectedNegativeStopTop} />
              <stop className={classes.thumbSelectedNegativeStopBottom} offset="1" />
            </linearGradient>
          </defs>
        </svg>
      )
    } else {
      return (
        <svg className={classes.thumb} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.999 4L13.239 3.06C13.0804 3.02025 12.9175 3.0001 12.754 3H8.73602C8.36452 3.00001 8.00037 3.10349 7.68439 3.29884C7.36841 3.49419 7.11307 3.77369 6.94702 4.106L3.44702 11.106C3.29465 11.4109 3.22274 11.7497 3.23812 12.0902C3.2535 12.4308 3.35566 12.7617 3.53489 13.0516C3.71412 13.3416 3.96449 13.5809 4.26221 13.7469C4.55994 13.9129 4.89515 14 5.23602 14H10H12M16.999 4L17 13L13.608 18.088C13.211 18.683 13 19.381 13 20.096C13 20.595 12.595 21 12.095 21H11.999C11.4686 21 10.9599 20.7893 10.5848 20.4142C10.2097 20.0391 9.99902 19.5304 9.99902 19V14M16.999 4H19C19.5304 4 20.0392 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V12C21 12.5304 20.7893 13.0391 20.4142 13.4142C20.0392 13.7893 19.5304 14 19 14H16.5" stroke="url(#paint0_linear_814_7254)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <defs>
            <linearGradient id="paint0_linear_814_7254" x1="23" y1="0.5" x2="3.27865e-07" y2="21.5" gradientUnits="userSpaceOnUse">
              <stop className={clsx(style, classes.thumbNegativeStopTop)} />
              <stop className={clsx(style, classes.thumbNegativeStopBottom)} offset="1" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  }

  return <></>
}

const voteToKey: Record<VOTE_OPTIONS, string> = {
  [VOTE_OPTIONS.voteDislike]: 'ArrowLeft',
  [VOTE_OPTIONS.voteShrug]: '-100',
  [VOTE_OPTIONS.voteLike]: 'ArrowRight'
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

  const currentVoteButton = currentVote === voteType;

  const style = usePickByState(
    classes.cool,
    classes.warm
  )

  const thumbIcon = getThumbIcon(style, voteType, currentVoteButton)

  return (
    <button className={classes.voteButton}
      onClick={() => changeVote(voteType)}
      //TODO: dev - set disabled back to `disabled={disabled}`
      disabled={!disabled}>
      <div className={
        clsx(
          style, classes.gradientBox,
          voteToGradientStyle[voteType],
          currentVoteButton ? classes.selected : '',
          //TODO: dev - set disabled back to `disabled ? ...`
          !disabled ? classes.disabled : ''
        )
      }>
        <div className={clsx(style, classes.dataBox)}>
          <div className={currentVoteButton ? classes.thumbBoxSelected : classes.thumbBox}>
            {thumbIcon}
          </div>
          <span className={classes.voteText}> {voteCounts[voteType]} </span>
        </div>
      </div>
    </button>
  );
};

export default VoteButton;