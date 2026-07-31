import apiClient from './apiClient';

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  location?: string;
  googleMapUrl?: string;
  emirate?: string;
  category?: string;
  duration?: string;
  bestTime?: string;
  bestSeason?: string;
  outdoor?: boolean;
  highlights?: { icon: string; text: string }[];
  idealFor?: { icon: string; text: string }[];
  distanceFromCity?: string;
  nearbyLandmarks?: string[];
  dressCode?: { recommended?: string; avoid?: string };
  safetyAndComfort?: { icon: string; title: string; description: string }[];
  accessibility?: { icon: string; title: string; description: string }[];
  experienceSteps?: { title: string; content: string }[];
  platformUrl?: string;
  whatsappNumber?: string;
  status: 'active' | 'inactive' | 'completed';
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export const projectService = {
  getAll: async () => {
    const response = await apiClient.get('/project');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  }
};
