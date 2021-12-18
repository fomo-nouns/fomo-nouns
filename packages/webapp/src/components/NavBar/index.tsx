import classes from './NavBar.module.css';
import { useEtherBalance } from '@usedapp/core';
import { Nav, Navbar } from 'react-bootstrap';
import config from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';

import WalletConnectModal from "../WalletConnectModal";
import fomologo from './fomologo.png';

const NavBar = () => {
  const treasuryBalance = useEtherBalance(config.fomoSettlerAddress);
  const settlementEtherscanLink = buildEtherscanHoldingsLink(config.fomoSettlerAddress);

  const contractFundsLow = treasuryBalance && treasuryBalance.lt(utils.parseEther('1'));

  return (
    <div className={classes.HeaderBar}>
      {/* {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )} */}
      <Navbar collapseOnSelect expand="lg">
        <Navbar.Brand href="/" className={classes.navBarBrand}>
          <img src={fomologo} alt='FOMO Nouns'
            width="115"
            className={classes.LogoImage}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-items" />
        <Navbar.Collapse id="nav-items" className="justify-content-end">
          <Nav.Item className={contractFundsLow ? classes.fundsLow : ''}>
            {treasuryBalance && (
              <Nav.Link
                href={settlementEtherscanLink}
                className={`${classes.nounsNavLink} ${classes.contractFunds}`}
                target="_blank"
                rel="noreferrer"
              >
                CONTRACT Ξ {Number(utils.formatEther(treasuryBalance)).toFixed(2)}
                {contractFundsLow && (
                  <span><br/>Please Donate!</span>
                )}
              </Nav.Link>
            )}
          </Nav.Item>
          <Nav.Link href="#wtf" className={classes.nounsNavLink}>
            WTF
          </Nav.Link>
          <Nav.Link href="#faq" className={classes.nounsNavLink}>
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
          <WalletConnectModal />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
