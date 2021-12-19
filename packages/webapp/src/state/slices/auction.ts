import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

interface AuctionState {
  activeAuction?: boolean;
  auctionEnd: number;
}

const initialState: AuctionState = {
  activeAuction: undefined,
  auctionEnd: 0
};

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setAuctionEnd: (state, action: PayloadAction<number | null>) => {
        state.auctionEnd = action.payload === null ? 0 : action.payload;
        state.activeAuction = dayjs().unix() < state.auctionEnd ? true : false;
    }
  },
});

export const { setAuctionEnd } = auctionSlice.actions;

export default auctionSlice.reducer;