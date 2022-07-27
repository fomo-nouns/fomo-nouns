import classes from './NavBar.module.css';
import { Nav, Navbar } from 'react-bootstrap';

import fomologo from './fomologo.png';
import PlayersConnected from '../PlayersConnected';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { useAppSelector } from '../../hooks';
import NavWallet from '../NavWallet';
import NavFunds from '../NavFunds';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const useGreyBg = useAppSelector(state => state.noun.isCoolBackground);

  const nonWalletButtonStyle = useGreyBg
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  return (
    <div className={classes.HeaderBar}>
      <Navbar collapseOnSelect expand="xl">
        <Navbar.Brand href="/" className={classes.navBarBrand}>
          <img src={fomologo} alt='FOMO Nouns'
            width="115"
            className={classes.LogoImage}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-items" className={classes.navBarToggle} />
        <Navbar.Collapse id="nav-items" className="justify-content-end">
          <Nav.Item className={classes.nounsNavLink}>
            <PlayersConnected />
          </Nav.Item>
          <NavFunds />
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
