import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum VOTE_OPTIONS {
  voteDislike = 'voteDislike',
  voteShrug = 'voteShrug',
  voteLike = 'voteLike'
}

interface VoteState {
  connected: boolean;
  currentVote?: VOTE_OPTIONS;
  voteCounts: Record<VOTE_OPTIONS, number>;
  attemptedSettle: boolean;
  score: number;
}

const initialState: VoteState = {
  connected: false,
  currentVote: undefined,
  voteCounts: {voteLike: 0, voteShrug: 0, voteDislike: 0}, // TODO: Make this programmatic
  attemptedSettle: false,
  score: 0
};

export const voteSlice = createSlice({
  name: 'vote',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean | undefined>) => {
      state.connected = action.payload ? true : false;
    },
    setCurrentVote: (state, action: PayloadAction<VOTE_OPTIONS | undefined | null>) => {
      state.currentVote = action.payload === null ? undefined : action.payload;
    },
    setScore: (state, action: PayloadAction<number | undefined >) => {
      state.score = action.payload === undefined ? 0 : action.payload;
    },
    incrementCount: (state, action: PayloadAction<VOTE_OPTIONS>) => {
      state.voteCounts[action.payload]++;
    },
    triggerSettlement: (state, action: PayloadAction<boolean | undefined >) => {
      state.attemptedSettle = true;
    },
    resetVotes: (state) => initialState
  },
});

export const {
  setConnected,
  setCurrentVote,
  setScore,
  incrementCount,
  triggerSettlement,
  resetVotes
} = voteSlice.actions;

export default voteSlice.reducer;