import { useState } from "react";
import { useAppSelector } from "../../hooks";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import classes from './PlayersConnected.module.css';

const NavPlayers: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const activeVoters = useAppSelector(state => state.vote.activeVoters);
  const voteConnected = useAppSelector(state => state.vote.connected);

  const [showStalePlayers, setShowStalePlayers] = useState(false);

  const buttonStyle = usePickByState(
    classes.coolInfo,
    classes.warmInfo,
  );

  // if (!activeAuction && voteConnected) {
    return (
      <div
        className={`${classes.wrapper} ${buttonStyle}`}
        onClick={() => setShowStalePlayers(!showStalePlayers)}>
        <div className={classes.button}>
          <div
            className="d-flex flex-row justify-content-around"
            style={{
              paddingTop: '1px',
            }}
          >
            <div className={classes.button}>
              <span className={classes.players}>Active Players</span>
              <div className={classes.divider} />
              {activeVoters}
            </div>
            <div className={showStalePlayers ? classes.stale : classes.staleHidden}>
              <span className={classes.players}>Stale</span>
              <div className={classes.divider} />
              {numConnections - activeVoters}
            </div>
          </div>
        </div>
      </div>
    );
  // } else {
  //   return <></>
  // }
};

export default NavPlayers;