import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  connected?: boolean;
}

const initialState: WebSocketState = {
  connected: false
};

export const voteSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean | undefined | null>) => {
      state.connected = action.payload === null ? undefined : action.payload;
    },
  },
});

export const { setConnected } = voteSlice.actions;

export default voteSlice.reducer;