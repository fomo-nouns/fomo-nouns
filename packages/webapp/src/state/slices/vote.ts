import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum VOTE_OPTIONS {
  voteHate = 'voteHate',
  voteDislike = 'voteDislike',
  voteLike = 'voteLike',
  voteLove = 'voteLove'
}

interface VoteState {
  currentVote?: VOTE_OPTIONS;
  voteCounts: Record<VOTE_OPTIONS, number>;
}

const initialState: VoteState = {
  currentVote: undefined,
  voteCounts: {voteLove: 0, voteLike: 0, voteDislike: 0, voteHate: 0} // TODO: Make this programmatic
};

export const voteSlice = createSlice({
  name: 'vote',
  initialState,
  reducers: {
    setCurrentVote: (state, action: PayloadAction<VOTE_OPTIONS | undefined | null>) => {
      state.currentVote = action.payload === null ? undefined : action.payload;
    },
  },
});

export const { setCurrentVote } = voteSlice.actions;

export default voteSlice.reducer;