import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Settlement {
    prevSettledBlockHash?: string;
    attemptedSettleBlockHash?: string
}

const initialState: Settlement = {
  prevSettledBlockHash: undefined,
  attemptedSettleBlockHash: undefined
};

export const settlementSlice = createSlice({
  name: 'settlement',
  initialState,
  reducers: {
    setPrevSettledBlockHash: (state, action: PayloadAction<string | undefined>) => {
      state.prevSettledBlockHash = action.payload;
    },
    setAttemptedSettleBlockHash: (state, action: PayloadAction<string | undefined>) => {
        state.attemptedSettleBlockHash = action.payload;
    },
    resetPrevSettledBlockHash: (state) => {
        state.prevSettledBlockHash = undefined;
    }
  },
});

export const { setPrevSettledBlockHash, setAttemptedSettleBlockHash, resetPrevSettledBlockHash } = settlementSlice.actions;

export default settlementSlice.reducer;