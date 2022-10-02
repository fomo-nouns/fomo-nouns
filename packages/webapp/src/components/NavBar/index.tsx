import classes from './NavBar.module.css';
import { Nav, Navbar } from 'react-bootstrap';

import fomoLogo from './fomologo.png';
import NavPlayers from '../NavPlayers';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
// import NavWallet from '../NavWallet';
import NavFunds from '../NavFunds';
import NavNounderNounSwitch from '../NavNounderNounSwitch';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';

const NavBar = () => {
  // const activeAccount = useAppSelector(state => state.account.activeAccount);

  const nonWalletButtonStyle = usePickByState(NavBarButtonStyle.COOL_INFO, NavBarButtonStyle.WARM_INFO)

  return (
    <div className={classes.HeaderBar}>
      <Navbar collapseOnSelect expand="lg">
        <div className={classes.brandAndPlayersWrapper}>
          <Navbar.Brand href="/" className={classes.navBarBrand}>
            <img src={fomoLogo} alt='FOMO Nouns'
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
          <NavNounderNounSwitch />
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
          {/* <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} /> */}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
