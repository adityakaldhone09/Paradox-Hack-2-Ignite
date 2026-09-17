import axios from 'axios';

// Resolve backend API URL dynamically from environment (e.g. Render production URL or local proxy)
const rawApiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
const cleanApiBase = rawApiBase.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: cleanApiBase ? `${cleanApiBase}/api/v1` : '/api/v1',
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
      // Clear stale auth and redirect to sign-in
      localStorage.removeItem('veriq_access_token');
      localStorage.removeItem('veriq_refresh_token');
      localStorage.removeItem('veriq_user');
      if (!window.location.pathname.startsWith('/signin')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// High-performance client-side response cache
const memoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const getCacheKey = (url: string, params?: any) => {
  return url + (params ? '?' + JSON.stringify(params) : '');
};

export const clearApiCache = (prefix?: string) => {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
};

export const getCachedApiResponse = <T = any>(url: string, params?: any): T | null => {
  const key = getCacheKey(url, params);
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data as T;
  }
  return null;
};

// Wrap apiClient methods with transparent caching & auto-invalidation
const rawGet = apiClient.get.bind(apiClient);
const rawPost = apiClient.post.bind(apiClient);
const rawPut = apiClient.put.bind(apiClient);
const rawDelete = apiClient.delete.bind(apiClient);

apiClient.get = (async (url: string, config?: any) => {
  const key = getCacheKey(url, config?.params);
  const cached = memoryCache.get(key);
  const now = Date.now();

  // Return instantly from cache if fresh
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    // Stale-while-revalidate background refresh if older than 5 seconds
    if (now - cached.timestamp > 5 * 1000) {
      rawGet(url, config)
        .then((res) => {
          memoryCache.set(key, { data: res.data, timestamp: Date.now() });
        })
        .catch(() => {});
    }
    return Promise.resolve({
      data: cached.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: config || {},
    } as any);
  }

  const response = await rawGet(url, config);
  memoryCache.set(key, { data: response.data, timestamp: Date.now() });
  return response;
}) as typeof apiClient.get;

apiClient.post = (async (...args: Parameters<typeof rawPost>) => {
  clearApiCache();
  return rawPost(...args);
}) as typeof apiClient.post;

apiClient.put = (async (...args: Parameters<typeof rawPut>) => {
  clearApiCache();
  return rawPut(...args);
}) as typeof apiClient.put;

apiClient.delete = (async (...args: Parameters<typeof rawDelete>) => {
  clearApiCache();
  return rawDelete(...args);
}) as typeof apiClient.delete;

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
  listMine: (email: string) => apiClient.get('/papers', { params: { created_by: email } }),
  get: (id: string) => apiClient.get(`/papers/${id}`),
  upload: (formData: FormData) =>
    apiClient.post('/papers/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  submit: (id: string) => apiClient.post(`/papers/${id}/submit`),
  approve: (id: string) => apiClient.post(`/papers/${id}/approve`),
  assignCentre: (id: string, data: any) => apiClient.post(`/papers/${id}/assign-centre`, data),
  release: (id: string) => apiClient.post(`/papers/${id}/release`),
  verify: (id: string, data?: any) => apiClient.post(`/papers/${id}/verify`, data),
  revoke: (id: string, data: { reason: string }) => apiClient.post(`/papers/${id}/revoke`, data),
  getChainOfCustody: (id: string) => apiClient.get(`/papers/${id}/chain-of-custody`),
};

export const accessApi = {
  requestAccess: (data: { paper_id: string; centre_id: string; device_fingerprint: string }) =>
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
  list: (params?: any) => apiClient.get('/devices', { params }),
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
  simulate: (eventType: string, paperId?: string, centreId?: string) =>
    apiClient.post('/demo/simulate', { event_type: eventType, paper_id: paperId, centre_id: centreId }),
  simulateEvent: (eventType: string) => apiClient.post('/demo/simulate', { event_type: eventType }),
};

export const userApi = {
  list: (params?: any) => apiClient.get('/users', { params }),
  create: (data: any) => apiClient.post('/users', data),
  update: (id: string, data: any) => apiClient.patch(`/users/${id}`, data),
  deactivate: (id: string) => apiClient.delete(`/users/${id}`),
};

export const healthApi = {
  check: () => apiClient.get('/health'),
  database: () => apiClient.get('/health/database'),
  blockchain: () => apiClient.get('/health/blockchain'),
  storage: () => apiClient.get('/health/storage'),
};
