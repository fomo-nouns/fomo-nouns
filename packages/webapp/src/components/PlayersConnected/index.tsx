import { useAppSelector } from "../../hooks";
import classes from './PlayersConnected.module.css';

const PlayersConnected: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const activeVoters = useAppSelector(state => state.vote.activeVoters);
  const voteConnected = useAppSelector(state => state.vote.connected);

  if (!activeAuction && voteConnected) {
    return (
      <div className={classes.Connected}>
        <span>
          Active Players: {activeVoters}
        </span>
        <span className={classes.Stale}>
          Stale: {numConnections - activeVoters}
        </span>
      </div>
    );
  } else {
    return <></>
  }
};
export default PlayersConnected;