import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMOJI_TYPE } from '../../components/VoteButton'

interface VoteState {
  currentVote?: EMOJI_TYPE;
}

const initialState: VoteState = {
  currentVote: undefined,
};

export const voteSlice = createSlice({
  name: 'vote',
  initialState,
  reducers: {
    setCurrentVote: (state, action: PayloadAction<EMOJI_TYPE | undefined | null>) => {
      state.currentVote = action.payload === null ? undefined : action.payload;
    },
  },
});

export const { setCurrentVote } = voteSlice.actions;

export default voteSlice.reducer;