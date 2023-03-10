import { Nav } from 'react-bootstrap';
import { useEtherBalance } from '@usedapp/core';
import config from '../../config';
import { utils } from 'ethers';
import { buildEtherscanWriteLink } from '../../utils/etherscan';
import classes from './NavFunds.module.css';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';

const NavFunds: React.FC<{}> = props => {
  const treasuryBalance = useEtherBalance(config.fomoSettlerAddress);
  const settlementWriteLink = buildEtherscanWriteLink(config.fomoSettlerAddress);

  const contractFundsLow = treasuryBalance && treasuryBalance.lt(utils.parseEther('1'));
  const treasuryBalanceFormatted = treasuryBalance && Number(utils.formatEther(treasuryBalance)).toFixed(2);

  const buttonText = (
    <>
      <div className={classes.wrapper}>
        <span className={classes.lowFundsText}>Low Funds</span>
        <div className={classes.divider} />
        Ξ {treasuryBalanceFormatted}
      </div>
    </>
  )

  return contractFundsLow ? (
    <>
      <Nav.Item className={classes.fundsLow}>
        {treasuryBalance && (
          <Nav.Link
            href={settlementWriteLink}
            className={classes.nounsNavLink}
            target="_blank"
            rel="noreferrer"
          >
            <NavBarButton
              buttonText={buttonText}
              buttonStyle={NavBarButtonStyle.RED_INFO}
            />
          </Nav.Link>
        )}
      </Nav.Item>
    </>
  ) : <></>
};

export default NavFunds;