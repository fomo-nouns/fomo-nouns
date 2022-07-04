import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

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
    addPendingTx: (state, action: PayloadAction<{from: string, hash: string}>) => {
        state.pendingTxs.push({ from: action.payload.from, hash: action.payload.hash })
    },
    resetPendingTx: (state) => {
        state.pendingTxs = []
    }
  },
});

export const { setMempoolListening, addPendingTx } = mempoolSlice.actions;

export default mempoolSlice.reducer;