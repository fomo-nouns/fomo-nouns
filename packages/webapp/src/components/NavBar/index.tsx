import classes from './NavBar.module.css';
import { useEtherBalance } from '@usedapp/core';
import { Nav, Navbar } from 'react-bootstrap';
import config from '../../config';
import { utils } from 'ethers';
import { buildEtherscanWriteLink, buildEtherscanHoldingsLink } from '../../utils/etherscan';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setDisplaySingleNoun } from '../../state/slices/noun';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import WalletConnectModal from "../WalletConnectModal";
import fomologo from './fomologo.png';
import PlayersConnected from '../PlayersConnected';

const NavBar = () => {
  const treasuryBalance = useEtherBalance(config.fomoSettlerAddress);
  const settlementHoldingsLink = buildEtherscanHoldingsLink(config.fomoSettlerAddress);
  const settlementWriteLink = buildEtherscanWriteLink(config.fomoSettlerAddress);

  const contractFundsLow = treasuryBalance && treasuryBalance.lt(utils.parseEther('1'));

  const scrollTo = (ref: string) => () => {
    const anchor = document.querySelector(ref); console.log(anchor);
    if (!anchor) return;
    anchor.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
  const displaySingleNoun = useAppSelector(state => state.noun.displaySingleNoun)!;
  const dispatch = useAppDispatch();

  function toggleSingleNounDisplay() {
    dispatch(setDisplaySingleNoun(!displaySingleNoun));
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
          {
            nextNounId != null && nextNounId % 10 === 0 &&
            <Nav.Link onClick={toggleSingleNounDisplay} className={classes.nounsNavLink}>
              {!displaySingleNoun ? <FontAwesomeIcon icon={faEyeSlash} className="icon" /> : <div className={classes.nogglesAscii}>⌐◨-◨</div>} {displaySingleNoun ? 'SHOW' : 'HIDE'} NOUN {nextNounId}
            </Nav.Link>
          }
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
          { <Nav.Item>
            <WalletConnectModal />
          </Nav.Item> }
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
