import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BackgroundState {
  useGreyBg?: boolean;
}

const initialState: BackgroundState = {
  useGreyBg: true
};

export const backgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    setActiveBackground: (state, action: PayloadAction<boolean | undefined | null>) => {
      state.useGreyBg = action.payload === null ? true : action.payload;
    },
  },
});

export const { setActiveBackground } = backgroundSlice.actions;

export default backgroundSlice.reducer;