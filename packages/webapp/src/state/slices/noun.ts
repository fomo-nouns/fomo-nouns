import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Noun {
  nextNounId?: number | null;
}

const initialState: Noun = {
  nextNounId: null
};

export const blockSlice = createSlice({
  name: 'noun',
  initialState,
  reducers: {
    setNextNounId: (state, action: PayloadAction<number | undefined>) => {
      state.nextNounId = action.payload;
    }
  },
});

export const { setNextNounId } = blockSlice.actions;

export default blockSlice.reducer;