import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BlockState {
  connected: boolean;
  blockTime: number;
  blockNumber?: number;
  blockHash: string;
}

const initialState: BlockState = {
  connected: false,
  blockTime: 0,
  blockNumber: undefined,
  blockHash: ""
};

export const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    setEthereumConnected: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.connected = true;
      } else {
        return initialState;
      }
    },
    setBlockAttr: (state, action: PayloadAction<{blockNumber: number, blockHash: string, blockTime: number}>) => {
      const { blockNumber, blockHash, blockTime } = action.payload;

      state.blockTime = blockTime;
      state.blockNumber = blockNumber;
      state.blockHash = blockHash;
    }
  },
});

export const { setEthereumConnected, setBlockAttr } = blockSlice.actions;

export default blockSlice.reducer;