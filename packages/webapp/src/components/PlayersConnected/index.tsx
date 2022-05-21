import { useState } from "react";
import { useAppSelector } from "../../hooks";
import classes from './PlayersConnected.module.css';

const PlayersConnected: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const activeVoters = useAppSelector(state => state.vote.activeVoters);
  const voteConnected = useAppSelector(state => state.vote.connected);

  const [showStalePlayers, setShowStalePlayers] = useState(false);

  if (!activeAuction && voteConnected) {
    return (
      <div 
        onClick={() => setShowStalePlayers(!showStalePlayers)}
        className={classes.Connected}>
        <span>
          Active Players: {activeVoters}
        </span>
        <span className={showStalePlayers ? classes.Stale : classes.StaleHidden}>
          · Stale: {numConnections - activeVoters}
        </span>
      </div>
    );
  } else {
    return <></>
  }
};
export default PlayersConnected;