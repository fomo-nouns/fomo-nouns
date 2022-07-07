import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import toast, { Toaster } from 'react-hot-toast';
import { removePendingBidTx, resetPendingSettleTx, SettleTx } from '../../state/slices/mempool';
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
  const pendingBidTxs = useAppSelector(state => state.mempool.pendingBidTxs);
  const listeningMempool = useAppSelector(state => state.mempool.listening);
  const prevSettledBlockHash = useAppSelector(state => state.settlement.prevSettledBlockHash);
  const blockhash = useAppSelector(state => state.block.blockHash);

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
    pendingBidTxs.forEach(tx => {
      const closeToAuctionEnd = dayjs().add(20, "seconds").unix() >= auctionEnd ? true : false
      if (closeToAuctionEnd) {
        toast.custom(
          <MempoolToast tx={tx} />, 
          {
              position: "bottom-center",
              duration: 6000
          }
        )
      }
      removePendingBidTx({ hash: tx.hash })
    })
  }, [pendingBidTxs, auctionEnd]);

  useEffect(() => {
    const lessThanMinTillAuctionEnd = auctionEnd && dayjs().add(1, 'minute').unix() >= auctionEnd ? true : false
    if ((activeAuction === false || lessThanMinTillAuctionEnd) && !listeningMempool) {
      dispatch(openEthereumMempoolSocket())
    }
    // [..., blockhash] used to always check time till auction end
    // and ensure websocket will open as auction comes to an end
  }, [activeAuction, auctionEnd, listeningMempool, blockhash, dispatch]);

  useEffect(() => {
    if (prevSettledBlockHash) {
      toast.dismiss();
      setActiveToasts([]);
      dispatch(resetPendingSettleTx());
    }
  }, [prevSettledBlockHash, dispatch]);

  return (
    <Toaster
        reverseOrder={false}
    />
  )
};
export default NotificationToast;