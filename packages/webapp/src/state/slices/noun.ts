import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Noun {
  nextNounId?: number | null;
  useGreyBg: boolean;
}

const initialState: Noun = {
  nextNounId: null,
  useGreyBg: true
};

export const blockSlice = createSlice({
  name: 'noun',
  initialState,
  reducers: {
    setNextNounId: (state, action: PayloadAction<number | undefined>) => {
      state.nextNounId = action.payload;
    },
    setActiveBackground: (state, action: PayloadAction<boolean | null>) => {
      state.useGreyBg = action.payload === null ? true : action.payload;
    }
  },
});

export const { setNextNounId, setActiveBackground } = blockSlice.actions;

export default blockSlice.reducer;