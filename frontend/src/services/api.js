import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const chat = {
  sendMessage: (message) => api.post('/api/chat', { message }),
  getHistory: () => api.get('/api/chat/history'),
};

export const files = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData);
  },
};

export default api;