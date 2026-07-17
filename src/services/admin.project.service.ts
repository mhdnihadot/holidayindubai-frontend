import apiClient from './apiClient';
import type { Project } from './project.service';

export const adminProjectService = {
  getAll: async () => {
    const response = await apiClient.get('/project');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  },

  create: async (data: Partial<Project>) => {
    const response = await apiClient.post('/project', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Project>) => {
    const response = await apiClient.put(`/project/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/project/${id}`);
    return response.data;
  }
};
