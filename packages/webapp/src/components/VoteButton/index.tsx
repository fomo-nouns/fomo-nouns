import { Button } from 'react-bootstrap';
import clsx from 'clsx';
import classes from './VoteButton.module.css';
import vote, { setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { provider } from '../../config';

export enum EMOJI_TYPE {
    hate = '🤢',
    dislike = '👎',
    like = '👍',
    love = '😍',
}

export enum EMOJI_STRING {
    hate = 'voteHate',
    dislike = 'voteDislike',
    like = 'voteLike',
    love = 'voteLove'
}

const VoteButton: React.FC<{emojiType: EMOJI_TYPE, client: any}> = props => {

  const getVoteString = (emojiType: EMOJI_TYPE) => {
    if (emojiType === EMOJI_TYPE.hate) {
      return 'voteHate'
    } else if (emojiType === EMOJI_TYPE.dislike) {
      return 'voteDislike'
    } else if (emojiType === EMOJI_TYPE.like) {
      return 'voteLike'
    } else {
      return 'voteLove'
    }
  }

  const activeVote = useAppSelector(state => state.vote.currentVote);
  const wsConnected = useAppSelector(state => state.websocket.connected);
  const { emojiType, client } = props;
  const votes = 0;
  const dispatch = useAppDispatch();
  const changeVote = () => {
    dispatch(setCurrentVote(emojiType));
    if (wsConnected){
      const payload = getVoteString(emojiType);
      console.log(payload);
      const voteMsg = {"action": "sendvote", "nounId": "0", "blockhash": 0, "vote": payload};
      client.send(JSON.stringify(voteMsg));
    }
  }

  return (
      <button className={activeVote === emojiType ? clsx(classes.emojiButton, classes.selected) : classes.emojiButton} onClick={changeVote}>
        <p className={classes.emojiText}> {emojiType} </p>
        <p className={classes.voteText}> {votes} </p>
      </button>
  );
};
  export default VoteButton;