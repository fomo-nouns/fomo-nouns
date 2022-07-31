import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettleTx {
  from: string
  hash: string
}

interface BidTx {
  from: string
  hash: string
  value: string
}

interface MempoolState {
  listening: boolean
  pendingSettleTxs: SettleTx[]
  pendingBidTxs: BidTx[]
}

const initialState: MempoolState = {
  listening: false,
  pendingSettleTxs: [],
  pendingBidTxs: [],
};

export const mempoolSlice = createSlice({
  name: 'mempool',
  initialState,
  reducers: {
    setMempoolListening: (state, action: PayloadAction<boolean>) => {
        if (action.payload) {
          state.listening = true;
        } else {
          return initialState;
        }
    },
    addPendingSettleTx: (state, action: PayloadAction<{from: string, hash: string}>) => {
        state.pendingSettleTxs.push({ from: action.payload.from, hash: action.payload.hash })
    },
    removePendingSettleTx: (state, action: PayloadAction<{hash: string}>) => {
      const index = state.pendingSettleTxs.findIndex(e => e.hash === action.payload.hash);
      if (index > -1) {
        state.pendingSettleTxs.splice(index, 1);
      }
  },
    resetPendingSettleTx: (state) => {
        state.pendingSettleTxs = []
    },
    addPendingBidTx: (state, action: PayloadAction<{from: string, hash: string, value: string}>) => {
        state.pendingBidTxs.push({ from: action.payload.from, hash: action.payload.hash, value: action.payload.value })
    },
    removePendingBidTx: (state, action: PayloadAction<{hash: string}>) => {
      //TODO: remove debug console outputs after testing
      console.log(`hash to remove: ${action.payload.hash}`)
      const index = state.pendingBidTxs.findIndex(e => e.hash === action.payload.hash);
      console.log(`index to remove: ${index}`)
      if (index > -1) {
        state.pendingBidTxs.splice(index, 1);
      }
      console.log("bending bids in state:")
      console.log(state.pendingBidTxs)
    },
    resetPendingBidTx: (state) => {
        console.log("reset pending bids")
        state.pendingBidTxs = []
    }
  },
});

export type { SettleTx, BidTx }

export const { setMempoolListening, addPendingSettleTx, removePendingSettleTx, resetPendingSettleTx, addPendingBidTx, removePendingBidTx, resetPendingBidTx } = mempoolSlice.actions;

export default mempoolSlice.reducer;