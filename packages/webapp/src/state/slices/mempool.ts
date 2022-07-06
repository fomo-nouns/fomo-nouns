import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettleTx {
    from: string,
    hash: string
}

interface MempoolState {
  listening: boolean,
  pendingTxs: SettleTx[];
}

const initialState: MempoolState = {
  listening: false,
  pendingTxs: []
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
        state.pendingTxs.push({ from: action.payload.from, hash: action.payload.hash })
    },
    resetPendingSettleTx: (state) => {
        state.pendingTxs = []
    }
  },
});

export type { SettleTx }

export const { setMempoolListening, addPendingSettleTx, resetPendingSettleTx } = mempoolSlice.actions;

export default mempoolSlice.reducer;