import classes from './NavBar.module.css';
import { Nav, Navbar } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setDisplaySingleNoun } from '../../state/slices/noun';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import fomologo from './fomologo.png';
import NavPlayers from '../NavPlayers';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import NavWallet from '../NavWallet';
import NavFunds from '../NavFunds';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const useGreyBg = useAppSelector(state => state.noun.isCoolBackground);

  const nonWalletButtonStyle = useGreyBg
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
  const displaySingleNoun = useAppSelector(state => state.noun.displaySingleNoun)!;
  const dispatch = useAppDispatch();

  function toggleSingleNounDisplay() {
    dispatch(setDisplaySingleNoun(!displaySingleNoun));
  }

  return (
    <div className={classes.HeaderBar}>
      <Navbar collapseOnSelect expand="lg">
        <div className={classes.brandAndPlayersWrapper}>
          <Navbar.Brand href="/" className={classes.navBarBrand}>
            <img src={fomologo} alt='FOMO Nouns'
              width="115"
              className={classes.LogoImage}
            />
          </Navbar.Brand>
          <Nav.Item className={classes.nounsNavLink}>
            <NavPlayers />
          </Nav.Item>
        </div>
        <Navbar.Toggle aria-controls="nav-items" className={classes.navBarToggle} />
        <Navbar.Collapse id="nav-items" className="justify-content-end">
          <NavFunds />
          {
            // TODO: style this in v2 style version
            nextNounId != null && nextNounId % 10 === 0 &&
            <Nav.Link onClick={toggleSingleNounDisplay} className={classes.nounsNavLink}>
              {!displaySingleNoun ? <FontAwesomeIcon icon={faEyeSlash} className="icon" /> : <div className={classes.nogglesAscii}>⌐◨-◨</div>} {displaySingleNoun ? 'SHOW' : 'HIDE'} NOUN {nextNounId}
            </Nav.Link>
          }
          <Nav.Link
            href="https://nouns.wtf/"
            className={classes.nounsNavLink}
            target="_blank"
            rel="noreferrer"
          >
            <NavBarButton
              buttonText={<>Nouns</>}
              buttonStyle={nonWalletButtonStyle}
            />
          </Nav.Link>
          <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
