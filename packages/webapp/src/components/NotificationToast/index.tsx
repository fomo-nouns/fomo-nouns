import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import toast, { Toaster } from 'react-hot-toast';
import { BidTx, removePendingBidTx, removePendingSettleTx, resetPendingSettleTx, SettleTx } from '../../state/slices/mempool';
import MempoolToast from '../MempoolToast';

const NotificationToast: React.FC<{}> = props => {
  const dispatch = useAppDispatch();

  const closeToAuctionEnd = useAppSelector(state => state.auction.closeToEnd);
  const pendingSettleTxs = useAppSelector(state => state.mempool.pendingSettleTxs);
  const pendingBidTxs = useAppSelector(state => state.mempool.pendingBidTxs);
  const prevSettledBlockHash = useAppSelector(state => state.settlement.prevSettledBlockHash);

  const showToast = (tx: SettleTx | BidTx, time: number) => {
    toast.custom(
      <MempoolToast tx={tx} />,
      {
        position: "bottom-center",
        duration: time
      }
    )
  }

  useEffect(() => {
    pendingSettleTxs.forEach(tx => {
      showToast(tx, 20000)
      dispatch(removePendingSettleTx({ hash: tx.hash }));
    })
  }, [pendingSettleTxs, dispatch]);

  useEffect(() => {
    pendingBidTxs.forEach(tx => {
      //TODO: uncomment after debug work done
      // if (closeToAuctionEnd) {
        showToast(tx, 6000)
      // }
      dispatch(removePendingBidTx({ hash: tx.hash }));
    })
  }, [pendingBidTxs, closeToAuctionEnd, dispatch]);

  useEffect(() => {
    if (prevSettledBlockHash) {
      toast.dismiss();
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