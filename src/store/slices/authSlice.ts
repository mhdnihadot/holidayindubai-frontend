import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { adminLoginThunk, adminLogoutThunk, adminCheckSessionThunk } from '../thunks/auth.thunks';

export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitializing: boolean;
}

const getInitialUser = (): User | null => {
  const userStr = localStorage.getItem('adminUser');
  if (userStr) {
    try { return JSON.parse(userStr); } catch { return null; }
  }
  return null;
};

const getInitialToken = (): string | null => {
  return localStorage.getItem('adminToken');
};

const initialState: AuthState = {
  isAuthenticated: !!getInitialToken(),
  user: getInitialUser(),
  token: getInitialToken(),
  loading: false,
  error: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(adminLogoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(adminCheckSessionThunk.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitializing = false;
      })
      .addCase(adminCheckSessionThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitializing = false;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
