import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

interface AuctionState {
  activeAuction?: boolean;
  auctionEnd: number;
  closeToEnd?: boolean;
}

const initialState: AuctionState = {
  activeAuction: undefined,
  auctionEnd: 0,
  closeToEnd: undefined
};

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    resetAuctionEnd: () => initialState,
    setAuctionEnd: (state, action: PayloadAction<number | null>) => {
        state.auctionEnd = action.payload === null ? 0 : action.payload;
        state.activeAuction = dayjs().unix() < state.auctionEnd ? true : false;
        state.closeToEnd = dayjs().add(5, "minutes").unix() >= state.auctionEnd ? true : false
    }
  },
});

export const { resetAuctionEnd, setAuctionEnd } = auctionSlice.actions;

export default auctionSlice.reducer;