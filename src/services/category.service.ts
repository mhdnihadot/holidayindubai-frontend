import apiClient from './apiClient';

export interface Category {
  _id?: string;
  name: string;
  icon: string;
}

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get('/category');
    return response.data;
  },
  
  sync: async (categories: { name: string; icon: string }[]) => {
    const response = await apiClient.post('/category/sync', { categories });
    return response.data;
  }
};
