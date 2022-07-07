import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import toast, { Toaster } from 'react-hot-toast';
import { resetPendingSettleTx, SettleTx } from '../../state/slices/mempool';
import { openEthereumMempoolSocket } from '../../middleware/alchemyMempoolWebsocket';
import dayjs from 'dayjs';
import MempoolToast from '../MempoolToast';

type ToastData = {
    id: string
    tx?: SettleTx
}

const NotificationToast: React.FC<{}> = props => {
  const dispatch = useAppDispatch();

  // local state variables
  const [activeToasts, setActiveToasts] = useState<ToastData[]>([]);

  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const auctionEnd = useAppSelector(state => state.auction.auctionEnd);
  const pendingSettleTxs = useAppSelector(state => state.mempool.pendingSettleTxs);
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
                <MempoolToast tx={tx} />, 
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
    const lessThanMinTillAuctionEnd = dayjs().add(1, 'minute').unix() >= auctionEnd ? true : false
    if ((activeAuction === false || lessThanMinTillAuctionEnd) && !listeningMempool) {
        dispatch(openEthereumMempoolSocket())
    }

    if (prevSettledBlockHash) {
      toast.dismiss();
      setActiveToasts([]);
      dispatch(resetPendingSettleTx());
    }
  }, [activeAuction, auctionEnd, listeningMempool, prevSettledBlockHash, dispatch]);

  return (
    <Toaster
        reverseOrder={false}
    />
  )
};
export default NotificationToast;