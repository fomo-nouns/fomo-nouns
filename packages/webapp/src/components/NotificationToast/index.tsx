import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import toast, { Toaster } from 'react-hot-toast';
import { resetPendingSettleTx, SettleTx } from '../../state/slices/mempool';
import { openEthereumMempoolSocket } from '../../middleware/alchemyMempoolWebsocket';
import FrontrunToast from '../FrontrunToast';

type ToastData = {
    id: string
    tx?: SettleTx
}

const NotificationToast: React.FC<{}> = props => {
  const dispatch = useAppDispatch();

  // local state variables
  const [activeToasts, setActiveToasts] = useState<ToastData[]>([]);

  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const pendingSettleTxs = useAppSelector(state => state.mempool.pendingTxs);
  const listeningMempool = useAppSelector(state => state.mempool.listening);
  const prevSettledBlockHash = useAppSelector(state => state.settlement.prevSettledBlockHash);

  useEffect(() => {
    const showingThisTx = (tx: SettleTx): boolean => {
        for (const activeToast of activeToasts) {
            if (activeToast.tx?.hash === tx.hash) {
                return true;
            }
        }
        return false;
      }

    pendingSettleTxs.forEach(tx => {
        if (!showingThisTx(tx)) {
            const id = toast.custom(
                <FrontrunToast tx={tx} />, 
                {
                    position: "bottom-center",
                    duration: 999999999
                }
            )
            setActiveToasts([...activeToasts, { id: id, tx: tx }])
        }
    })
  }, [pendingSettleTxs, activeToasts]);

  useEffect(() => {
    if (activeAuction === false && !listeningMempool) {
        dispatch(openEthereumMempoolSocket())
    }

    if (prevSettledBlockHash) {
      toast.dismiss();
      setActiveToasts([]);
      dispatch(resetPendingSettleTx());
    }
  }, [activeAuction, listeningMempool, prevSettledBlockHash, dispatch]);

  // TODO: remove when done with dev
  useEffect(() => {
    dispatch(openEthereumMempoolSocket())
  }, [dispatch]);

  return (
    <Toaster
        reverseOrder={false}
    />
  )
};
export default NotificationToast;