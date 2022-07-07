import { SettleTx } from '../../state/slices/mempool';
import { shortAddress, shortENS } from '../../utils/addressAndENSDisplayUtils';
import { useReverseENSLookUp } from '../../utils/ensLookup';
import { buildEtherscanTxLink } from '../../utils/etherscan';
import classes from './FrontrunToast.module.css';

const FrontrunToast: React.FC<{ tx: SettleTx }> = props => {
  const { tx } = props

  const ens = useReverseENSLookUp(tx.from)

  const etherscanLink = buildEtherscanTxLink(tx.hash)
  const ensOrAddress = ens ? shortENS(ens) : shortAddress(tx.from)

  return (
    <a href={etherscanLink} target="_blank" rel="noopener noreferrer" className={classes.Link}>
        <div className={classes.ToastWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" className={classes.Icon} fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <p className={classes.Text}>{ensOrAddress} is tryin to frontrun us</p>
        </div>
    </a>
  )
};
export default FrontrunToast;