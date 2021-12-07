import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectionsState {
  numConnections: number
}

const initialState: ConnectionsState = {
    numConnections: 1
};

export const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setNumConnections: (state, action: PayloadAction<number | undefined>) => {
      state.numConnections = action.payload === undefined ? 1 : action.payload;
    }
  },
});

export const { setNumConnections} = connectionsSlice.actions;

export default connectionsSlice.reducer;