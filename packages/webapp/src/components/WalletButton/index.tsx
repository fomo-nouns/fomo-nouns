import { FC } from 'react';
import classes from './WalletButton.module.css';

export enum WALLET_TYPE {
  metamask = 'metamask',
  walletconnect = 'walletconnect',
  brave = 'brave'
}

interface WalletButtonProps {
  onClick: () => void;
  walletType: WALLET_TYPE;
  disabled?: boolean;
}

const WalletButton: FC<WalletButtonProps> = ({ onClick, walletType, disabled }) => {
  const getWalletName = () => {
    switch (walletType) {
      case WALLET_TYPE.metamask:
        return 'MetaMask';
      case WALLET_TYPE.walletconnect:
        return 'WalletConnect';
      case WALLET_TYPE.brave:
        return 'Brave Wallet';
      default:
        return '';
    }
  };

  const getWalletIcon = () => {
    switch (walletType) {
      case WALLET_TYPE.metamask:
        return '🦊';
      case WALLET_TYPE.walletconnect:
        return '🔗';
      case WALLET_TYPE.brave:
        return '🦁';
      default:
        return '';
    }
  };

  return (
    <button
      className={classes.walletButton}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={classes.icon}>{getWalletIcon()}</span>
      <span className={classes.text}>{getWalletName()}</span>
    </button>
  );
};

export default WalletButton; 