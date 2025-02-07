// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user_id: number | null;
  token: string | null;
}

const initialState: UserState = {
  user_id: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user_id: number; token: string }>) {
      state.user_id = action.payload.user_id;
      state.token = action.payload.token;
    },
    clearUser(state) {
      state.user_id = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;