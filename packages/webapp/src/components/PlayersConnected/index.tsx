import { useAppSelector } from "../../hooks";
import classes from './PlayersConnected.module.css';

const PlayersConnected: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const voteConnected = useAppSelector(state => state.vote.connected);

  if (!activeAuction && voteConnected) {
    return (
      <span className={classes.Connected}>
        Players: {numConnections}
      </span>
    );
  } else {
    return <></>
  }
};
export default PlayersConnected;