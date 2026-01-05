import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const searchAPI = {
  search: (query, count = 10) => api.get('/search', { params: { query, count } }),
};

export const historyAPI = {
  getAll: () => api.get('/history'),
  getOne: (id) => api.get(`/history/${id}`),
  add: (data) => api.post('/history', data),
  update: (id, data) => api.put(`/history/${id}`, data),
  delete: (id) => api.delete(`/history/${id}`),
  clearAll: () => api.delete('/history'),
};

export default api;
