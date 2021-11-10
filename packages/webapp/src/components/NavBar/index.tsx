import { useAppSelector } from '../../hooks';
import  ShortAddress from '../ShortAddress';
import classes from './NavBar.module.css';
import { useState } from 'react';
import { useEtherBalance, useEthers } from '@usedapp/core';
import WalletConnectModal from '../WalletConnectModal';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import clsx from 'clsx';
import config, { CHAIN_ID } from '../../config';
import { utils } from 'ethers';

const NavBar = () => {
    const activeAccount = useAppSelector(state => state.account.activeAccount);
    const { deactivate } = useEthers();
  
    const [showConnectModal, setShowConnectModal] = useState(false);
  
    const showModalHandler = () => {
      setShowConnectModal(true);
    };
    const hideModalHandler = () => {
      setShowConnectModal(false);
    };
  
    const connectedContent = (
      <>
        <Nav.Item>
          <Nav.Link className={clsx(classes.nounsNavLink, classes.addressNavLink)} disabled>
            <span className={classes.greenStatusCircle} />
            <span>{activeAccount && <ShortAddress address={activeAccount} />}</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            className={clsx(classes.nounsNavLink, classes.disconnectBtn)}
            onClick={() => {
              setShowConnectModal(false);
              deactivate();
              setShowConnectModal(false);
            }}
          >
            DISCONNECT
          </Nav.Link>
        </Nav.Item>
      </>
    );
  
    const disconnectedContent = (
      <>
        <Nav.Link
          className={clsx(classes.nounsNavLink, classes.connectBtn)}
          onClick={showModalHandler}
        >
          CONNECT WALLET
        </Nav.Link>
      </>
    );
  
    return (
      <>
        {showConnectModal && activeAccount === undefined && (
          <WalletConnectModal/>
        )}
        <Navbar expand="lg">
          <Container>
            {Number(CHAIN_ID) !== 1 && (
              <Nav.Item>
                TESTNET
              </Nav.Item>
            )}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
              {activeAccount ? connectedContent : disconnectedContent}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  };
  
  export default NavBar;