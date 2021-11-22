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

const WalletConnectModal: React.FC<{}> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const dispatch = useAppDispatch();
  const { deactivate, activate, account } = useEthers();
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  const showModalHandler = () => {
    setShowConnectModal(true);
  };
  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const connectedContent = (
    <>
    <div className={classes.walletConnectWrapper}>
      <button className={classes.disconnectBtn} onClick={deactivate}>
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
          activate(injected);
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
          activate(walletlink);
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
          activate(walletlink);
        }}
        walletType={WALLET_TYPE.coinbaseWallet}
      />
      <WalletButton
        onClick={() => {
          const injected = new InjectedConnector({
            supportedChainIds,
          });
          activate(injected);
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
          activate(trezor);
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
    <>
      {activeAccount ? connectedContent : disconnectedContent}
      {showConnectModal && <Modal title="Connect your wallet" content={wallets} onDismiss={hideModalHandler} />}
    </>
  )
};
export default WalletConnectModal;