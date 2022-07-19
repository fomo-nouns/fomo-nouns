import classes from './NavBar.module.css';
import { useEtherBalance } from '@usedapp/core';
import { Nav, Navbar } from 'react-bootstrap';
import config from '../../config';
import { utils } from 'ethers';
import { buildEtherscanWriteLink, buildEtherscanHoldingsLink } from '../../utils/etherscan';

import fomologo from './fomologo.png';
import PlayersConnected from '../PlayersConnected';
import { NavBarButtonStyle } from '../NavBarButton';
import { useAppSelector } from '../../hooks';
import NavWallet from '../NavWallet';

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const treasuryBalance = useEtherBalance(config.fomoSettlerAddress);
  const settlementHoldingsLink = buildEtherscanHoldingsLink(config.fomoSettlerAddress);
  const settlementWriteLink = buildEtherscanWriteLink(config.fomoSettlerAddress);
  const useGreyBg = useAppSelector(state => state.noun.isCoolBackground);

  const contractFundsLow = treasuryBalance && treasuryBalance.lt(utils.parseEther('1'));

  // TODO: check this
  const nonWalletButtonStyle = useGreyBg
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const scrollTo = (ref: string) => () => {
    const anchor = document.querySelector(ref); console.log(anchor);
    if (!anchor) return;
    anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={classes.HeaderBar}>
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand href="/" className={classes.navBarBrand}>
          <img src={fomologo} alt='FOMO Nouns'
            width="115"
            className={classes.LogoImage}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-items" />
        <Navbar.Collapse id="nav-items" className="justify-content-end">
          <Nav.Item className={classes.nounsNavLink}>
            <PlayersConnected />
          </Nav.Item>
          <Nav.Item className={contractFundsLow ? classes.fundsLow : ''}>
            {treasuryBalance && (
              <Nav.Link
                href={settlementHoldingsLink}
                className={classes.nounsNavLink}
                target="_blank"
                rel="noreferrer"
              >
                CONTRACT Ξ {Number(utils.formatEther(treasuryBalance)).toFixed(2)}
              </Nav.Link>
            )}
          </Nav.Item>
          
          <Nav.Item className={contractFundsLow ? classes.fundsLow : ''}>
            <Nav.Link
              href={settlementWriteLink}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
            >
              DONATE
            </Nav.Link>
          </Nav.Item>
          <Nav.Link onClick={scrollTo('#wtf')} className={classes.nounsNavLink}>
            WTF
          </Nav.Link>
          <Nav.Link onClick={scrollTo('#faq')} className={classes.nounsNavLink}>
            FAQ
          </Nav.Link>
          <Nav.Link
            href="https://nouns.wtf/"
            className={classes.nounsNavLink}
            target="_blank"
            rel="noreferrer"
          >
            NOUNS
          </Nav.Link>
          <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
