import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  signature?: string;
  address?: string;
  nounId?: string;
}

const initialState: AuthState = {
  signature: undefined,
  address: undefined,
  nounId: undefined
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<{signature: string; address: string; nounId: string}>) => {
      state.signature = action.payload.signature;
      state.address = action.payload.address;
      state.nounId = action.payload.nounId;
    },
    clearAuthData: (state) => {
      state.signature = undefined;
      state.address = undefined;
      state.nounId = undefined;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer; 