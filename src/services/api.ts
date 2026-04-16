import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Customers
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Tickets
export const ticketsAPI = {
  getAll: () => api.get('/tickets'),
  getById: (id: string) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: string, data: any) => api.put(`/tickets/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/tickets/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/tickets/${id}`),
};

// Quotes
export const quotesAPI = {
  getAll: () => api.get('/quotes'),
  getByTicketId: (ticketId: string) => api.get(`/quotes/ticket/${ticketId}`),
  create: (data: any) => api.post('/quotes', data),
  update: (id: string, data: any) => api.put(`/quotes/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/quotes/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/quotes/${id}`),
};

// Services
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export default api;
