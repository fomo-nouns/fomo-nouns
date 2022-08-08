import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Noun {
  nextNounId?: number | null;
  isCoolBackground: boolean;
  displaySingleNoun: boolean;
}

const initialState: Noun = {
  nextNounId: null,
  isCoolBackground: true,
  displaySingleNoun: true
};

export const nounSlice = createSlice({
  name: 'noun',
  initialState,
  reducers: {
    setNextNounId: (state, action: PayloadAction<number | undefined>) => {
      state.nextNounId = action.payload;
    },
    setActiveBackground: (state, action: PayloadAction<boolean | null>) => {
      state.isCoolBackground = action.payload === null ? true : action.payload;
    },
    setDisplaySingleNoun: (state, action: PayloadAction<boolean | null>) => {
      state.displaySingleNoun = action.payload === null ? true : action.payload;
    }
  },
});

export const { setNextNounId, setActiveBackground, setDisplaySingleNoun } = nounSlice.actions;

export default nounSlice.reducer;