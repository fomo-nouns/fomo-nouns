import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BlockState {
  blockNumber?: number;
  blockHash?: string
}

const initialState: BlockState = {
  blockNumber: undefined,
  blockHash: ""
};

export const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    setBlockNumber: (state, action: PayloadAction<number | undefined>) => {
      state.blockNumber = action.payload;
    },
    setBlockHash: (state, action: PayloadAction<string | null | undefined>) => {
      state.blockHash = action.payload === null ? undefined : action.payload;
    },
  },
});

export const { setBlockNumber, setBlockHash } = blockSlice.actions;

export default blockSlice.reducer;