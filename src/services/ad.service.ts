import apiClient from './apiClient';

export interface Ad {
  id: string;
  title: string;
  websiteImage: string;
  mobileImage: string;
  project?: any;
  url?: string;
  order?: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export const adService = {
  getAll: async () => {
    const response = await apiClient.get('/ad');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/ad/${id}`);
    return response.data;
  }
};
