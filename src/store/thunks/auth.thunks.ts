import { createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/admin.service';

interface LoginArgs {
  email: string;
  password: string;
}

export const adminLoginThunk = createAsyncThunk(
  'auth/adminLogin',
  async (credentials: LoginArgs, { rejectWithValue }) => {
    try {
      const response = await adminService.login(credentials.email, credentials.password);
      const token = response.accessToken;
      const user = response.user;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to login');
    }
  }
);

export const adminLogoutThunk = createAsyncThunk(
  'auth/adminLogout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken') || undefined;
      await adminService.logout(token);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return true;
    } catch (error: any) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to logout');
    }
  }
);

export const adminCheckSessionThunk = createAsyncThunk(
  'auth/adminCheckSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return rejectWithValue('No token found');

      const response = await adminService.getProfile(token);
      const user = response.user;
      
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      return { user, token };
    } catch (error: any) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return rejectWithValue(error.response?.data?.message || error.message || 'Session expired');
    }
  }
);

export const userCheckSessionThunk = createAsyncThunk(
  'auth/userCheckSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('No user token found');

      // Import dynamically to avoid circular dependencies if any
      const { default: apiClient } = await import('../../services/apiClient');
      const response = await apiClient.get('/user/profile');
      
      if (response.data?.status === 'success' && response.data?.data) {
        localStorage.setItem('userUser', JSON.stringify(response.data.data));
        return { user: response.data.data };
      }
      throw new Error('Invalid profile response');
    } catch (error: any) {
      // Note: apiClient already handles clearing local storage if the refresh token fails.
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);
