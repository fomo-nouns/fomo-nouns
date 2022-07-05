import { SettleTx } from '../../state/slices/mempool';
import classes from './FrontrunToast.module.css';

const FrontrunToast: React.FC<{ tx: SettleTx }> = props => {
  const { tx } = props

  return (
    <div className={classes.ToastWrapper}>
        <p>Someone is frontrunning us</p>
    </div>
  )
};
export default FrontrunToast;