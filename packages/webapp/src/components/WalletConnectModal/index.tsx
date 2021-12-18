import Modal from '../Modal';
import WalletButton from "../WalletButton";
import { WALLET_TYPE } from '../WalletButton';
import { useEthers } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import config, { CHAIN_ID } from '../../config';
import classes from './WalletConnectModal.module.css';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveAccount } from '../../state/slices/account';
import { AbstractConnector } from '@web3-react/abstract-connector';

const WalletConnectModal: React.FC<{}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const numConnections = useAppSelector(state => state.vote.numConnections);
  const dispatch = useAppDispatch();
  const { deactivate, activate, account } = useEthers();
  const [showConnectModal, setShowConnectModal] = useState(false);

  const activateAccount = async (connector: AbstractConnector) => {
    await activate(connector);
    dispatch(setActiveAccount(account));
  }

  const deactivateAccount = () => {
    deactivate();
    dispatch(setActiveAccount(undefined));
  }

  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const connectedContent = (
    <>
    <div className={classes.walletConnectWrapper}>
      <button className={classes.disconnectBtn} onClick={deactivateAccount}>
        DISCONNECT
        <span className={classes.greenStatusCircle}> </span>
      </button>
    </div>
    </>
  )

  const disconnectedContent = (
    <>
    <div className={classes.walletConnectWrapper}>
      <button className={classes.connectBtn} onClick={showModalHandler} >
          CONNECT WALLET
      </button>
    </div>
    </>
  );

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const supportedChainIds = [CHAIN_ID];
    
  useEffect(() => {
    if(activeAccount){
      hideModalHandler();
    }
  }, [account, dispatch, activate, activeAccount]);
  

  const wallets = (
    <>
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({
            supportedChainIds,
          });
          activateAccount(injected);
        }}
        walletType={WALLET_TYPE.metamask}
      />
      <WalletButton
        onClick={() => {
          const walletlink = new WalletConnectConnector({
            supportedChainIds,
            chainId: CHAIN_ID,
            rpc: {
              [CHAIN_ID]: config.jsonRpcUri,
            },
          });
          activateAccount(walletlink);
        }}
        walletType={WALLET_TYPE.walletconnect}
      />
      <WalletButton
        onClick={() => {
          const walletlink = new WalletLinkConnector({
            appName: 'Nouns.WTF',
            appLogoUrl: 'https://nouns.wtf/static/media/logo.cdea1650.svg',
            url: config.jsonRpcUri,
            supportedChainIds,
          });
          activateAccount(walletlink);
        }}
        walletType={WALLET_TYPE.coinbaseWallet}
      />
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({
            supportedChainIds,
          });
          activateAccount(injected);
        }}
        walletType={WALLET_TYPE.brave}
      />
      <WalletButton
        onClick={() => {
          const trezor = new TrezorConnector({
            chainId: CHAIN_ID,
            url: config.jsonRpcUri,
            manifestAppUrl: 'nounops+trezorconnect@protonmail.com',
            manifestEmail: 'https://nouns.wtf',
          });
          activateAccount(trezor);
        }}
        walletType={WALLET_TYPE.trezor}
      />
      <div className={classes.clickable} onClick={() => setAdvancedOpen(!advancedOpen)}>
        Advanced {advancedOpen ? '^' : 'v'}
      </div>
      {advancedOpen && (
        <div
          className={classes.clickable}
          onClick={() => {
            console.log(localStorage.removeItem('walletconnect'));
          }}
        >
          Clear WalletConnect Data
        </div>
      )}
    </>
  );
  return (
    <div className={classes.WalletArea}>
      {activeAccount ? connectedContent : disconnectedContent}
      {showConnectModal && <Modal title="Connect your wallet" content={wallets} onDismiss={hideModalHandler} />}
      {!activeAuction && (numConnections <= 1 ? <span className={classes.Players}>{numConnections} player online!</span> :
                             <span className={classes.Players}>{numConnections} players online!</span>)}
    </div>
  )
};
export default WalletConnectModal;