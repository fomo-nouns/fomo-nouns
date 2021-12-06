import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScoreState {
  score: number;
}

const initialState: ScoreState = {
  score: 0,
};

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    setScore: (state, action: PayloadAction<number | undefined >) => {
      state.score = action.payload === undefined ? 0 : action.payload;
    },
    resetScore: (state) => initialState
  },
});

export const { setScore, resetScore} = scoreSlice.actions;

export default scoreSlice.reducer;