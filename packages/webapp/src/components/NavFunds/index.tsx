import { Nav } from 'react-bootstrap';
import { useEtherBalance } from '@usedapp/core';
import config from '../../config';
import { utils } from 'ethers';
import { buildEtherscanWriteLink, buildEtherscanHoldingsLink } from '../../utils/etherscan';
import classes from './NavFunds.module.css';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { useAppSelector } from '../../hooks';

const NavFunds: React.FC<{}> = props => {
    const treasuryBalance = useEtherBalance(config.fomoSettlerAddress);
    const settlementHoldingsLink = buildEtherscanHoldingsLink(config.fomoSettlerAddress);
    const settlementWriteLink = buildEtherscanWriteLink(config.fomoSettlerAddress);
    const useGreyBg = useAppSelector(state => state.noun.isCoolBackground);

    const nonWalletButtonStyle = useGreyBg
        ? NavBarButtonStyle.COOL_INFO
        : NavBarButtonStyle.WARM_INFO;

    const contractFundsLow = treasuryBalance && treasuryBalance.lt(utils.parseEther('1'));

    return (
      <>
        <Nav.Item className={contractFundsLow ? classes.fundsLow : ''}>
            {treasuryBalance && (
              <Nav.Link
                href={settlementHoldingsLink}
                className={classes.nounsNavLink}
                target="_blank"
                rel="noreferrer"
              >
                <NavBarButton
                  buttonText={<>Low Funds Ξ {Number(utils.formatEther(treasuryBalance)).toFixed(2)}</>}
                  buttonStyle={nonWalletButtonStyle}
                />
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
              <NavBarButton
                buttonText={<>Donate</>}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
          </Nav.Item>
       </>
    )
};

export default NavFunds;