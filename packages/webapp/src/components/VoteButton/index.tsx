import { Button } from 'react-bootstrap';
import clsx from 'clsx';
import classes from './VoteButton.module.css';
import vote, { setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';

export enum EMOJI_TYPE {
    hate = '🤢',
    dislike = '👎',
    like = '👍',
    love = '😍',
}

const VoteButton: React.FC<{emojiType: EMOJI_TYPE }> = props => {
  const activeVote = useAppSelector(state => state.vote.currentVote);


  const votes = 0;

  const dispatch = useAppDispatch();  
  const { emojiType } = props;
  
  const changeVote = () => {
    dispatch(setCurrentVote(emojiType));
  }

  return (
      <button className={activeVote === emojiType ? clsx(classes.emojiButton, classes.selected) : classes.emojiButton} onClick={changeVote}>
        <p className={classes.emojiText}> {emojiType} </p>
        <p className={classes.voteText}> {votes} </p>
      </button>
  );
};
  export default VoteButton;