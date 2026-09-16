import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Access Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('veriq_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Auto redirect or handle refresh
    }
    return Promise.reject(error);
  }
);

// Domain API Services
export const authApi = {
  login: (data: any) => apiClient.post('/auth/login', data),
  signup: (data: any) => apiClient.post('/auth/signup', data),
  forgotPassword: (data: any) => apiClient.post('/auth/forgot-password', data),
  resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  getDemoUsers: () => apiClient.get('/auth/demo-users'),
};

export const examApi = {
  list: (params?: any) => apiClient.get('/exams', { params }),
  create: (data: any) => apiClient.post('/exams', data),
  get: (id: string) => apiClient.get(`/exams/${id}`),
};

export const paperApi = {
  list: (params?: any) => apiClient.get('/papers', { params }),
  get: (id: string) => apiClient.get(`/papers/${id}`),
  upload: (formData: FormData) =>
    apiClient.post('/papers/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  approve: (id: string) => apiClient.post(`/papers/${id}/approve`),
  assignCentre: (id: string, data: any) => apiClient.post(`/papers/${id}/assign-centre`, data),
  release: (id: string) => apiClient.post(`/papers/${id}/release`),
  verify: (id: string, data?: any) => apiClient.post(`/papers/${id}/verify`, data),
  revoke: (id: string, data: { reason: string }) => apiClient.post(`/papers/${id}/revoke`, data),
  getChainOfCustody: (id: string) => apiClient.get(`/papers/${id}/chain-of-custody`),
};

export const accessApi = {
  requestAccess: (data: { paper_id: string; centre_id: string; device_fingerprint: string; override_time?: string }) =>
    apiClient.post('/access/request', data),
  getLogs: (params?: any) => apiClient.get('/access/logs', { params }),
};

export const centreApi = {
  list: (params?: any) => apiClient.get('/centres', { params }),
  get: (id: string) => apiClient.get(`/centres/${id}`),
  create: (data: any) => apiClient.post('/centres', data),
  authorize: (id: string) => apiClient.post(`/centres/${id}/authorize`),
  revoke: (id: string) => apiClient.post(`/centres/${id}/revoke`),
};

export const deviceApi = {
  list: () => apiClient.get('/devices'),
  create: (data: any) => apiClient.post('/devices', data),
  authorize: (id: string) => apiClient.post(`/devices/${id}/authorize`),
  revoke: (id: string) => apiClient.post(`/devices/${id}/revoke`),
};

export const blockchainApi = {
  getStatus: () => apiClient.get('/blockchain/status'),
  getBlocks: () => apiClient.get('/blockchain/blocks'),
  getTransactions: (params?: any) => apiClient.get('/blockchain/transactions', { params }),
  getTransaction: (txHash: string) => apiClient.get(`/blockchain/transactions/${txHash}`),
  getPaperHistory: (paperId: string) => apiClient.get(`/blockchain/papers/${paperId}`),
};

export const securityApi = {
  getSummary: () => apiClient.get('/security/summary'),
  getHeatmap: () => apiClient.get('/security/heatmap'),
  getThreatFeed: () => apiClient.get('/security/threat-feed'),
};

export const incidentApi = {
  list: (params?: any) => apiClient.get('/incidents', { params }),
  create: (data: any) => apiClient.post('/incidents', data),
  get: (id: string) => apiClient.get(`/incidents/${id}`),
  acknowledge: (id: string) => apiClient.post(`/incidents/${id}/acknowledge`),
  resolve: (id: string, data: { resolution_notes: string }) => apiClient.post(`/incidents/${id}/resolve`, data),
};

export const auditApi = {
  getReport: (paperId: string) => apiClient.get(`/audit/report/${paperId}`),
};

export const demoApi = {
  simulate: (eventType: string) => apiClient.post('/demo/simulate', { event_type: eventType }),
  simulateEvent: (eventType: string) => apiClient.post('/demo/simulate', { event_type: eventType }),
};
