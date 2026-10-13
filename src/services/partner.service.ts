import apiClient from './apiClient';

// HID PARTNER accounts — admin endpoints under /admin/partners

export type PartnerStatus = 'active' | 'deactivated';

export interface PartnerItem {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  status: PartnerStatus;
  lastLoginAt?: string;
  createdAt: string;
  activityCount?: number;
  pendingRequestCount?: number;
}

export interface PartnerActivity {
  id: string;
  title: string;
  image: string | null;
  emirate?: string;
  category?: string;
  status: string;
}

export interface PartnerDetails extends PartnerItem {
  activities: PartnerActivity[];
}

export type EventCounts = { view: number; website: number; whatsapp: number; call: number };

export interface PartnerAnalytics {
  range: { from: string; to: string; unique: boolean; interval: 'hour' | 'day' };
  totals: EventCounts;
  previousTotals: EventCounts;
  bySource: Record<'app_ios' | 'app_android' | 'web_mobile' | 'web_desktop', EventCounts>;
  byProject: { id: string; title: string; counts: EventCounts }[];
  series: ({ date: string } & EventCounts)[];
}

export interface ChangeRequestItem {
  id: string;
  partner: { id: string; name: string; businessName: string } | null;
  project: { id: string; title: string; image: string | null } | null;
  message: string;
  status: 'pending' | 'done';
  adminNote: string;
  resolvedAt?: string;
  createdAt: string;
}

export const partnerService = {
  list: async (params?: { search?: string; status?: string }) => {
    const response = await apiClient.get('/admin/partners', { params });
    return response.data.data as PartnerItem[];
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/admin/partners/${id}`);
    return response.data.data as PartnerDetails;
  },
  updateStatus: async (id: string, status: PartnerStatus) => {
    const response = await apiClient.patch(`/admin/partners/${id}/status`, { status });
    return response.data.data as PartnerItem;
  },
  resetPassword: async (id: string, password: string) => {
    const response = await apiClient.post(`/admin/partners/${id}/reset-password`, { password });
    return response.data;
  },
  assignActivity: async (id: string, projectId: string) => {
    const response = await apiClient.post(`/admin/partners/${id}/activities`, { projectId });
    return response.data;
  },
  unassignActivity: async (id: string, projectId: string) => {
    const response = await apiClient.delete(`/admin/partners/${id}/activities/${projectId}`);
    return response.data;
  },
  getAnalytics: async (id: string, params: { from: string; to: string; unique?: boolean }) => {
    const response = await apiClient.get(`/admin/partners/${id}/analytics`, { params });
    return response.data.data as PartnerAnalytics;
  },
  listChangeRequests: async (params?: { status?: string; partnerId?: string }) => {
    const response = await apiClient.get('/admin/partners/change-requests', { params });
    return response.data.data as ChangeRequestItem[];
  },
  updateChangeRequest: async (id: string, data: { status?: 'pending' | 'done'; adminNote?: string }) => {
    const response = await apiClient.patch(`/admin/partners/change-requests/${id}`, data);
    return response.data.data as ChangeRequestItem;
  },
};

export const getApiErrorMessage = (error: unknown, fallback: string): string =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;
