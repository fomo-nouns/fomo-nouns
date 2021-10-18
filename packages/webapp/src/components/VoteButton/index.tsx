import { Button } from 'react-bootstrap';
import classes from './VoteButton.module.css';
import { setCurrentVote } from '../../state/slices/vote';
import { useAppDispatch, useAppSelector } from '../../hooks';

export enum EMOJI_TYPE {
    hate = '🤢',
    dislike = '👎',
    like = '👍',
    love = '😍',
}

const VoteButton: React.FC<{emojiType: EMOJI_TYPE }> = props => {

  const dispatch = useAppDispatch();  
  const { emojiType } = props;
  
  const changeVote = () => {
    dispatch(setCurrentVote(emojiType));
  }

  return (
    <Button className={classes.emojiButton} onClick={changeVote}>
      {emojiType}
      0
    </Button>
  );
};
  export default VoteButton;