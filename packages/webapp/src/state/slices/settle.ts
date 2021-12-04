import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettleState {
  attemptedSettle?: boolean;
}

const initialState: SettleState = {
  attemptedSettle: false,
};

export const settleSlice = createSlice({
  name: 'settle',
  initialState,
  reducers: {
    setAttemptedSettle: (state, action: PayloadAction<boolean | undefined >) => {
      state.attemptedSettle = action.payload === undefined ? false : action.payload;
    },
    resetAttemptedSettle: (state) => initialState
  },
});

export const { setAttemptedSettle, resetAttemptedSettle} = settleSlice.actions;

export default settleSlice.reducer;