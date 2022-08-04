import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import toast, { Toaster } from 'react-hot-toast';
import { removePendingBidTx, removePendingSettleTx, resetPendingSettleTx } from '../../state/slices/mempool';
import { closeEthereumMempoolSocket, openEthereumMempoolSocket } from '../../middleware/alchemyMempoolWebsocket';
import MempoolToast from '../MempoolToast';

const NotificationToast: React.FC<{}> = props => {
  const dispatch = useAppDispatch();

  const activeAuction = useAppSelector(state => state.auction.activeAuction);
  const closeToAuctionEnd = useAppSelector(state => state.auction.closeToEnd);
  const pendingSettleTxs = useAppSelector(state => state.mempool.pendingSettleTxs);
  const pendingBidTxs = useAppSelector(state => state.mempool.pendingBidTxs);
  const listeningMempool = useAppSelector(state => state.mempool.listening);
  const prevSettledBlockHash = useAppSelector(state => state.settlement.prevSettledBlockHash);
  const blockhash = useAppSelector(state => state.block.blockHash);

  useEffect(() => {
    pendingSettleTxs.forEach(tx => {
      toast.custom(
        <MempoolToast tx={tx} />,
        {
          position: "bottom-center",
          duration: 20000
        }
      )
      dispatch(removePendingSettleTx({ hash: tx.hash }));
    })
  }, [pendingSettleTxs, dispatch]);

  useEffect(() => {
    pendingBidTxs.forEach(tx => {
      if (closeToAuctionEnd) {
        toast.custom(
          <MempoolToast tx={tx} />,
          {
            position: "bottom-center",
            duration: 6000
          }
        )
      }
      //TODO: remove debug console outputs after testing
      console.log('call removePendingBidTx()')
      dispatch(removePendingBidTx({ hash: tx.hash }));
    })
  }, [pendingBidTxs, closeToAuctionEnd, dispatch]);

  useEffect(() => {
    if ((activeAuction === false || closeToAuctionEnd) && !listeningMempool) {
      dispatch(openEthereumMempoolSocket())
    } else if (activeAuction === true && !closeToAuctionEnd && listeningMempool) {
      dispatch(closeEthereumMempoolSocket())
    }
    // [..., blockhash] used to always check time till auction end
    // and ensure websocket will open as auction comes to an end
  }, [activeAuction, closeToAuctionEnd, listeningMempool, blockhash, dispatch]);

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