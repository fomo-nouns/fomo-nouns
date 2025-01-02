import { FC, useState, useEffect } from 'react';
import Modal from '../Modal';
import WalletButton, { WALLET_TYPE } from "../WalletButton";
import { useEthers } from '@usedapp/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import config, { CHAIN_ID } from '../../config';
import classes from './WalletConnectModal.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createSignatureMessage } from '../../utils/signature';
import { setAuthData } from '../../state/slices/auth';

const supportedChainIds = [CHAIN_ID];

// Connector configurations
const connectors = {
  metamask: () => new InjectedConnector({ supportedChainIds }),
  walletconnect: () => new WalletConnectConnector({
    supportedChainIds,
    chainId: CHAIN_ID,
    rpc: { [CHAIN_ID]: config.jsonRpcUri }
  }),
  brave: () => new InjectedConnector({ supportedChainIds })
};

interface WalletConnectModalProps {
  onClose?: () => void;
  requireSignature?: boolean;
}

const WalletConnectModal: FC<WalletConnectModalProps> = ({ onClose, requireSignature = false }) => {
  const [showModal, setShowModal] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const dispatch = useAppDispatch();
  const { activate, account, library } = useEthers();
  const nextNounId = useAppSelector(state => state.noun.nextNounId);

  useEffect(() => {
    const handleAccountConnection = async () => {
      if (account && library) {
        if (requireSignature) {
          await requestSignature(account);
        }
        setShowModal(false);
        if (onClose) onClose();
      }
    };

    handleAccountConnection();
  }, [account, library]);

  const requestSignature = async (address: string) => {
    try {
      const signer = library?.getSigner();
      if (!signer || !nextNounId) return;

      const message = createSignatureMessage(address, nextNounId.toString());
      const signature = await signer.signMessage(message);

      dispatch(setAuthData({
        signature,
        address: address.toLowerCase(),
        nounId: nextNounId.toString()
      }));
    } catch (error) {
      console.error('Error getting signature:', error);
    }
  };

  const handleConnect = async (connectorType: keyof typeof connectors) => {
    try {
      setIsConnecting(true);
      const connector = connectors[connectorType]();
      await activate(connector);
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnecting(false);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    if (onClose) onClose();
  };

  const WalletOptions = () => (
    <>
      <WalletButton
        onClick={() => handleConnect('metamask')}
        walletType={WALLET_TYPE.metamask}
        disabled={isConnecting}
      />
      <WalletButton
        onClick={() => handleConnect('walletconnect')}
        walletType={WALLET_TYPE.walletconnect}
        disabled={isConnecting}
      />
      <WalletButton
        onClick={() => handleConnect('brave')}
        walletType={WALLET_TYPE.brave}
        disabled={isConnecting}
      />
      <button 
        className={classes.clearDataBtn}
        onClick={() => localStorage.removeItem('walletconnect')}
      >
        Clear WalletConnect Data
      </button>
    </>
  );

  return showModal ? (
    <Modal 
      title="Connect your wallet" 
      content={<WalletOptions />} 
      onDismiss={handleDismiss}
    />
  ) : null;
};

export default WalletConnectModal; 