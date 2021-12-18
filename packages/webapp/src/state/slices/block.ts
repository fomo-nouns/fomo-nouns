import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BlockState {
  blockTime: number;
  blockNumber?: number;
  blockHash: string;
}

const initialState: BlockState = {
  blockTime: 0,
  blockNumber: undefined,
  blockHash: ""
};

export const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    setBlockAttr: (state, action: PayloadAction<{blocknumber: number, blockhash: string}>) => {
      state.blockTime = Date.now(); // Approximate but better ensures proper CX
      const { blocknumber, blockhash } = action.payload;
      state.blockNumber = blocknumber;
      state.blockHash = blockhash;
    }
  },
});

export const { setBlockAttr } = blockSlice.actions;

export default blockSlice.reducer;