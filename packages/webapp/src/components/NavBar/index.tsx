import classes from './NavBar.module.css';
import { Nav, Navbar } from 'react-bootstrap';

import fomoLogo from './fomologo.png';
import fomoLogoSmall from './fomologo-small.png';
import NavPlayers from '../NavPlayers';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
// import NavWallet from '../NavWallet';
// import { useAppSelector } from '../../hooks';
import NavFunds from '../NavFunds';
import NavNounderNounSwitch from '../NavNounderNounSwitch';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import { buildEtherscanWriteLink } from '../../utils/etherscan';
import config from '../../config';

const NavBar = () => {
  // const activeAccount = useAppSelector(state => state.account.activeAccount);

  const settlementWriteLink = buildEtherscanWriteLink(config.fomoSettlerAddress);

  const nonWalletButtonStyle = usePickByState(NavBarButtonStyle.COOL_INFO, NavBarButtonStyle.WARM_INFO)

  const logo = window.innerWidth < 600 ? fomoLogoSmall : fomoLogo

  return (
    <div className={classes.HeaderBar}>
      <Navbar collapseOnSelect expand="lg">
        <div className={classes.brandAndPlayersWrapper}>
          <Navbar.Brand href="/" className={classes.navBarBrand}>
            <img src={logo} alt='FOMO Nouns'
              height="52"
              className={classes.LogoImage}
            />
          </Navbar.Brand>
          <Nav.Item className={classes.nounsNavLink}>
            <NavPlayers />
          </Nav.Item>
        </div>
        <div className={classes.nonHideItems}>
          <NavNounderNounSwitch />
        </div>
        <Navbar.Toggle aria-controls="nav-items" className={classes.navBarToggle} />
        <Navbar.Collapse id="nav-items" className="flex-grow-0">
          <NavFunds />
          <Nav.Link
            href={settlementWriteLink}
            className={classes.nounsNavLink}
            target="_blank"
            rel="noreferrer"
          >
            <NavBarButton
              buttonText={<>Donate</>}
              buttonStyle={nonWalletButtonStyle}
            />
          </Nav.Link>
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
