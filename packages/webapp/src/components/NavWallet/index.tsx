import Davatar from '@davatar/react';
import { useEthers } from '@usedapp/core';
import React, { useState } from 'react';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { getNavBarButtonVariant, NavBarButtonStyle } from '../NavBarButton';
import classes from './NavWallet.module.css';
import navDropdownClasses from '../NavWallet/NavBarDropdown.module.css';
import { Dropdown } from 'react-bootstrap';
import WalletConnectModal from '../WalletConnectModal';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import WalletConnectButton from './WalletConnectButton';
import {
  veryShortAddress,
  veryShortENS,
} from '../../utils/addressAndENSDisplayUtils';
// TODO: check this
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';

interface NavWalletProps {
  address: string;
  buttonStyle?: NavBarButtonStyle;
}

type Props = {
  onClick: (e: any) => void;
  value: string;
};

type RefType = number;

type CustomMenuProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  labeledBy?: string;
};

const NavWallet: React.FC<NavWalletProps> = props => {
  const { address, buttonStyle } = props;

  const [buttonUp, setButtonUp] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { library: provider } = useEthers();
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { deactivate } = useEthers();
  const ens = useReverseENSLookUp(address);
  
  const shortAddress = veryShortAddress(address);

  const setModalStateHandler = (state: boolean) => {
    setShowConnectModal(state);
  };

  const switchWalletHandler = () => {
    setShowConnectModal(false);
    setButtonUp(false);
    deactivate();
    setShowConnectModal(false);
    setShowConnectModal(true);
  };

  const disconectWalletHandler = () => {
    setShowConnectModal(false);
    setButtonUp(false);
    deactivate();
  };

  const statePrimaryButtonClass = usePickByState(
    navDropdownClasses.whiteInfo,
    navDropdownClasses.coolInfo,
    navDropdownClasses.warmInfo,
  );

  const stateSelectedDropdownClass = usePickByState(
    navDropdownClasses.whiteInfoSelected,
    navDropdownClasses.dropdownActive,
    navDropdownClasses.dropdownActive,
  );

  const mobileTextColor = usePickByState(
    'rgba(140, 141, 146, 1)',
    'rgba(121, 128, 156, 1)',
    'rgba(142, 129, 127, 1)',
  );

  const mobileBorderColor = usePickByState(
    'rgba(140, 141, 146, .5)',
    'rgba(121, 128, 156, .5)',
    'rgba(142, 129, 127, .5)',
  );

  const connectWalletButtonStyle = usePickByState(
    NavBarButtonStyle.WHITE_WALLET,
    NavBarButtonStyle.COOL_WALLET,
    NavBarButtonStyle.WARM_WALLET,
  );

  const faSortDown = <>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </>

  const faSortUp = <>
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
     <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
   </svg>
  </>

  const customDropdownToggle = React.forwardRef<RefType, Props>(({ onClick, value }, ref) => (
    <>
      <div
        className={clsx(
          navDropdownClasses.wrapper,
          buttonUp ? stateSelectedDropdownClass : statePrimaryButtonClass,
        )}
        onClick={e => {
          e.preventDefault();
          onClick(e);
        }}
      >
        <div className={navDropdownClasses.button}>
          <div className={classes.icon}>
            {' '}
            <Davatar size={21} address={address} provider={provider} />
          </div>
          <div className={navDropdownClasses.dropdownBtnContent}>{ens ? ens : shortAddress}</div>
          <div className={buttonUp ? navDropdownClasses.arrowUp : navDropdownClasses.arrowDown}>
            {buttonUp ? faSortUp : faSortDown}
          </div>
        </div>
      </div>
    </>
  ));

  const CustomMenu = React.forwardRef((props: CustomMenuProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className}
        aria-labelledby={props.labeledBy}
      >
        <div>
          <div
            onClick={switchWalletHandler}
            className={clsx(
              classes.dropDownTop,
              navDropdownClasses.button,
              navDropdownClasses.dropdownPrimaryText,
              usePickByState(
                navDropdownClasses.whiteInfoSelectedTop,
                navDropdownClasses.coolInfoSelected,
                navDropdownClasses.warmInfoSelected,
              ),
            )}
          >
            Switch wallet
          </div>

          <div
            onClick={disconectWalletHandler}
            className={clsx(
              classes.dropDownBottom,
              navDropdownClasses.button,
              usePickByState(
                navDropdownClasses.whiteInfoSelectedBottom,
                navDropdownClasses.coolInfoSelected,
                navDropdownClasses.warmInfoSelected,
              ),
              classes.disconnectText,
            )}
          >
            Disconnect
          </div>
        </div>
      </div>
    );
  });

  const renderENS = (ens: string) => {
    // Return different length based on locale?
    return veryShortENS(ens);
  };

  const renderAddress = (address: string) => {
    // Return different length based on locale?
    return veryShortAddress(address);
  };

  const walletConnectedContentMobile = (
    <div className={clsx(navDropdownClasses.nounsNavLink, responsiveUiUtilsClasses.mobileOnly)}>
      <div
        className={'d-flex flex-row justify-content-between'}
        style={{
          justifyContent: 'space-between',
        }}
      >
        <div className={navDropdownClasses.connectContentMobileWrapper}>
          <div className={clsx(navDropdownClasses.wrapper, getNavBarButtonVariant(buttonStyle))}>
            <div className={navDropdownClasses.button}>
              <div className={classes.icon}>
                {' '}
                <Davatar size={21} address={address} provider={provider} />
              </div>
              <div className={navDropdownClasses.dropdownBtnContent}>
                {ens ? renderENS(ens) : renderAddress(address)}
              </div>
            </div>
          </div>
        </div>

        <div className={`d-flex flex-row  ${classes.connectContentMobileText}`}>
          <div
            style={{
              borderRight: `1px solid ${mobileBorderColor}`,
              color: mobileTextColor,
            }}
            className={classes.mobileSwitchWalletText}
            onClick={switchWalletHandler}
          >
            Switch
          </div>
          <div className={classes.disconnectText} onClick={disconectWalletHandler}>
            Sign out
          </div>
        </div>
      </div>
    </div>
  );

  const walletConnectedContentDesktop = (
    <Dropdown
      className={clsx(navDropdownClasses.nounsNavLink, responsiveUiUtilsClasses.desktopOnly)}
      onToggle={() => setButtonUp(!buttonUp)}
    >
      <Dropdown.Toggle as={customDropdownToggle} id="dropdown-custom-components" />
      <Dropdown.Menu className={`${navDropdownClasses.desktopDropdown} `} as={CustomMenu} />
    </Dropdown>
  );

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={() => setModalStateHandler(false)} />
      )}
      {activeAccount ? (
        <>
          {walletConnectedContentDesktop}
          {walletConnectedContentMobile}
        </>
      ) : (
        <WalletConnectButton
          className={clsx(navDropdownClasses.nounsNavLink, navDropdownClasses.connectBtn)}
          onClickHandler={() => setModalStateHandler(true)}
          buttonStyle={connectWalletButtonStyle}
        />
      )}
    </>
  );
};

export default NavWallet;
