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
  pendingSettleTxs: SettleTx[]
  pendingBidTxs: BidTx[]
}

const initialState: MempoolState = {
  pendingSettleTxs: [],
  pendingBidTxs: [],
};

export const mempoolSlice = createSlice({
  name: 'mempool',
  initialState,
  reducers: {
    addPendingSettleTx: (state, action: PayloadAction<{from: string, hash: string}>) => {
        state.pendingSettleTxs.push({ from: action.payload.from, hash: action.payload.hash })
    },
    removePendingSettleTx: (state, action: PayloadAction<{hash: string}>) => {
        state.pendingSettleTxs = state.pendingSettleTxs.filter(e => e.hash !== action.payload.hash);
    },
    resetPendingSettleTx: (state) => {
        state.pendingSettleTxs = []
    },
    addPendingBidTx: (state, action: PayloadAction<{from: string, hash: string, value: string}>) => {
        state.pendingBidTxs.push({ from: action.payload.from, hash: action.payload.hash, value: action.payload.value })
    },
    removePendingBidTx: (state, action: PayloadAction<{hash: string}>) => {
        state.pendingBidTxs = state.pendingBidTxs.filter(e => e.hash !== action.payload.hash);
    },
    resetPendingBidTx: (state) => {
        state.pendingBidTxs = []
    }
  },
});

export type { SettleTx, BidTx }

export const { 
  addPendingSettleTx, 
  removePendingSettleTx, 
  resetPendingSettleTx, 
  addPendingBidTx, 
  removePendingBidTx, 
  resetPendingBidTx 
} = mempoolSlice.actions;

export default mempoolSlice.reducer;