import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuctionState {
  activeAuction?: boolean;
  auctionEnd: number;
}

const initialState: AuctionState = {
  activeAuction: false,
  auctionEnd: 0
};

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<boolean | undefined | null>) => {
      state.activeAuction = action.payload === null ? false : action.payload;
    },
    setAuctionEnd: (state, action: PayloadAction<number | null>) => {
        state.auctionEnd = action.payload === null ? 0 : action.payload
    }
  },
});

export const { setActiveAuction, setAuctionEnd } = auctionSlice.actions;

export default auctionSlice.reducer;