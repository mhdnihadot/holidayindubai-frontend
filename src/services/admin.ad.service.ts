import apiClient from './apiClient';
import type { Ad } from './ad.service';

export const adminAdService = {
  getAll: async () => {
    const response = await apiClient.get('/ad');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/ad/${id}`);
    return response.data;
  },

  create: async (data: Partial<Ad>) => {
    const response = await apiClient.post('/ad', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Ad>) => {
    const response = await apiClient.put(`/ad/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/ad/${id}`);
    return response.data;
  }
};
