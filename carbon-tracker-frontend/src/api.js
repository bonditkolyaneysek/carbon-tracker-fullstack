import axios from 'axios';

const api = axios.create({
  baseURL: 'https://appealing-analysis-production-3974.up.railway.app/',
  headers: {
    'Accept': 'application/json',
  },
});

// Automatically attach the saved token to every request, if one exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;