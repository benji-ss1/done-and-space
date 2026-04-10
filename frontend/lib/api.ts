import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};
export const leadsAPI = {
  getAll: (params?: any) => api.get('/leads', { params }),
  getStats: () => api.get('/leads/stats'),
  getOne: (id: string) => api.get(`/leads/${id}`),
  update: (id: string, data: any) => api.put(`/leads/${id}`, data),
  interact: (id: string, data: any) => api.post(`/leads/${id}/interact`, data),
  assign: (id: string, agent_id: string) => api.patch(`/leads/${id}/assign`, { agent_id }),
};
export const propertiesAPI = {
  getAll: (params?: any) => api.get('/properties/admin/all', { params }),
  getPublic: (params?: any) => api.get('/properties', { params }),
  getOne: (id: string) => api.get(`/properties/${id}`),
  create: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.put(`/properties/${id}`, data),
  submit: (id: string) => api.patch(`/properties/${id}/submit`),
  approve: (id: string) => api.patch(`/properties/${id}/approve`),
  publish: (id: string) => api.patch(`/properties/${id}/publish`),
  getPending: () => api.get('/properties/admin/pending-approvals'),
};
export const dealsAPI = {
  getAll: () => api.get('/deals'),
  getSummary: () => api.get('/deals/summary'),
  getOne: (id: string) => api.get(`/deals/${id}`),
  create: (data: any) => api.post('/deals', data),
  advanceStage: (id: string, stage: string, notes?: string) =>
    api.patch(`/deals/${id}/stage`, { stage, notes }),
  approveCommission: (id: string) => api.patch(`/deals/${id}/commission/approve`),
};
export const reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getLeads: () => api.get('/reports/leads'),
  getAgents: () => api.get('/reports/agents'),
  getListings: () => api.get('/reports/listings'),
};
export const agentsAPI = {
  getApplications: (params?: any) => api.get('/agents/applications', { params }),
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/agents/applications/${id}`, { status, notes }),
};
