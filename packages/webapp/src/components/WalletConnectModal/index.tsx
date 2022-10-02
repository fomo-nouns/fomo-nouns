import Modal from '../Modal';
import WalletButton from '../WalletButton';
import { WALLET_TYPE } from '../WalletButton';
import { useEthers } from '@usedapp/core';
import clsx from 'clsx';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import config, { CHAIN_ID } from '../../config';
import classes from './WalletConnectModal.module.css';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useAppDispatch } from '../../hooks';
import { setActiveAccount } from '../../state/slices/account';

const WalletConnectModal: React.FC<{ onDismiss: () => void }> = props => {
  const { onDismiss } = props;
  const { activate, account } = useEthers();
  const dispatch = useAppDispatch();
  const supportedChainIds = [CHAIN_ID];

  const activateAccount = async (connector: AbstractConnector) => {
    await activate(connector);
    dispatch(setActiveAccount(account));
  }

  const wallets = (
    <div className={classes.walletConnectModal}>
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
          const fortmatic = new FortmaticConnector({
            apiKey: 'pk_live_60FAF077265B4CBA',
            chainId: CHAIN_ID,
          });
          activateAccount(fortmatic);
        }}
        walletType={WALLET_TYPE.fortmatic}
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
            manifestAppUrl: 'https://nouns.wtf',
            manifestEmail: 'nounops+trezorconnect@protonmail.com',
          });
          activateAccount(trezor);
        }}
        walletType={WALLET_TYPE.trezor}
      />
      <div
        className={clsx(classes.clickable, classes.walletConnectData)}
        onClick={() => localStorage.removeItem('walletconnect')}
      >
        Clear WalletConnect Data
      </div>
    </div>
  );
  return (
    <Modal title={'Connect your wallet'} content={wallets} onDismiss={onDismiss} />
  );
};

export default WalletConnectModal;
