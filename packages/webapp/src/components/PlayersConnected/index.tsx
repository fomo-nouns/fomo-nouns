import { useAppSelector } from "../../hooks";
import classes from './PlayersConnected.module.css';

const PlayersConnected: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const voteConnected = useAppSelector(state => state.vote.connected);

  if (!activeAuction && voteConnected) {
    return (
      <span className={classes.Players}>
        {numConnections} {numConnections <= 1 ? 'player' : 'players'} online!
      </span>
    );
  } else {
    return <></>
  }
};
export default PlayersConnected;