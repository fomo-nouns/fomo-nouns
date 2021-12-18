import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum VOTE_OPTIONS {
  voteDislike = 'voteDislike',
  voteShrug = 'voteShrug',
  voteLike = 'voteLike'
}

interface VoteState {
  connected: boolean;
  numConnections: number;
  currentVote?: VOTE_OPTIONS;
  voteCounts: Record<VOTE_OPTIONS, number>;
  attemptedSettle: boolean;
  votingActive: boolean;
  score: number;
}

const initialState: VoteState = {
  connected: false,
  numConnections: 1,
  currentVote: undefined,
  voteCounts: {voteLike: 0, voteShrug: 0, voteDislike: 0}, // TODO: Make this programmatic
  attemptedSettle: false,
  votingActive: true,
  score: 0
};

export const voteSlice = createSlice({
  name: 'vote',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.connected = true;
      } else {
        return initialState;
      }
    },
    setNumConnections: (state, action: PayloadAction<number | undefined>) => {
      state.numConnections = action.payload === undefined ? 1 : action.payload;
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
    endVoting: (state) => {
      state.votingActive = false;
    },
    resetVotes: (state) => { return { ...initialState, connected: state.connected } }
  },
});

export const {
  setConnected,
  setNumConnections,
  setCurrentVote,
  setScore,
  incrementCount,
  triggerSettlement,
  endVoting,
  resetVotes
} = voteSlice.actions;

export default voteSlice.reducer;