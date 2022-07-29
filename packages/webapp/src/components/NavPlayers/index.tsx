import clsx from "clsx";
import { useState } from "react";
import { useAppSelector } from "../../hooks";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import NavBarButton, { NavBarButtonStyle } from "../NavBarButton";
import classes from './PlayersConnected.module.css';

const NavPlayers: React.FC<{}> = props => {
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const activeVoters = useAppSelector(state => state.vote.activeVoters);
  const voteConnected = useAppSelector(state => state.vote.connected);

  const [showStalePlayers, setShowStalePlayers] = useState(false);

  const playersTextStyle = usePickByState(
    classes.playersTextCool,
    classes.playersTextWarm,
  );

  const dividerStyle = usePickByState(
    classes.dividerCool,
    classes.dividerWarm,
  );

  const buttonText = (
    <>
        <div className={classes.wrapper}>
            <div className={classes.wrapper}>
              <span className={playersTextStyle}>Active Players</span>
              <div className={dividerStyle} />
              {activeVoters}
            </div>
            <div className={clsx(showStalePlayers ? classes.stale : classes.staleHidden)}>
              <span className={playersTextStyle}>Stale</span>
              <div className={dividerStyle} />
              {numConnections - activeVoters}
            </div>
        </div>
    </>
  )

  const buttonStyle = usePickByState(
    NavBarButtonStyle.COOL_INFO,
    NavBarButtonStyle.WARM_INFO,
  );

  // if (!activeAuction && voteConnected) {
    return (
      <div onClick={() => setShowStalePlayers(!showStalePlayers)}>
        <NavBarButton
          buttonText={buttonText}
          buttonStyle={buttonStyle}
          disabled={false}
        />
      </div>
    );
  // } else {
  //   return <></>
  // }
};

export default NavPlayers;