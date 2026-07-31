import apiClient from './apiClient';

export interface EnquiryItem {
  id: string;
  user?: { _id: string; name: string; email: string; phone?: string };
  project?: { _id: string; title: string; location?: string; images?: string[] };
  name: string;
  phone: string;
  message?: string;
  status: string;
  createdAt: string;
}

export const enquiryService = {
  getAllEnquiries: async (token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/enquiry', { headers });
    return response.data.data as EnquiryItem[];
  },
  updateStatus: async (id: string, status: string, token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.patch(`/enquiry/${id}/status`, { status }, { headers });
    return response.data.data as EnquiryItem;
  },
  deleteEnquiry: async (id: string, token?: string) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.delete(`/enquiry/${id}`, { headers });
    return response.data;
  },
};
