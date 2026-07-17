import apiClient from './apiClient';

export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken?: string;
  user: AdminUser;
}

export const adminService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/admin/login', { email, password });
    // The backend returns { status: 'success', data: { admin: AdminUser, token: string } }
    return {
      accessToken: response.data.data.token || response.data.data.accessToken,
      user: response.data.data.admin,
    };
  },
  logout: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.post('/admin/logout', {}, { headers });
    return response.data;
  },
  getProfile: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/admin/profile', { headers });
    // The backend returns { status: 'success', data: AdminUser }
    return { user: response.data.data };
  },
  getAllUsers: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/admin/users', { headers });
    return response.data.data;
  },
};
