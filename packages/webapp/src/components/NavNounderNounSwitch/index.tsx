import { Nav } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setDisplaySingleNoun } from "../../state/slices/noun";
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import classes from './NavNounderNounSwitch.module.css';
import clsx from "clsx";

import oneCoolNoun from "../../assets/nav-cool-one-noun.png"
import twoCoolNouns from "../../assets/nav-cool-two-nouns.png"

import oneWarmNoun from "../../assets/nav-warm-one-noun.png"
import twoWarmNouns from "../../assets/nav-warm-two-nouns.png"

const NavNounderNounSwitch: React.FC<{}> = props => {
    const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
    const displaySingleNoun = useAppSelector(state => state.noun.displaySingleNoun)!;
    const dispatch = useAppDispatch();

    function toggleSingleNounDisplay() {
        dispatch(setDisplaySingleNoun(!displaySingleNoun));
    }

    const style = usePickByState(
        classes.coolInfo,
        classes.warmInfo,
    );

    const oneNounByState = usePickByState(
        oneCoolNoun,
        oneWarmNoun,
    );

    const twoNounsByState = usePickByState(
        twoCoolNouns,
        twoWarmNouns,
    );

    if (nextNounId !== null && nextNounId % 10 === 0) {
        return (
            <Nav.Link onClick={toggleSingleNounDisplay} className={clsx(classes.wrapper, style)}>
                <div className={classes.button}>
                    <img
                        src={displaySingleNoun ? twoNounsByState : oneNounByState}
                        alt='Nounder Noun Switch'
                        className={classes.image}
                    />
                </div>
            </Nav.Link>
        );
    } else {
        return <></>
    }
};

export default NavNounderNounSwitch;