import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://petmart-backend.onrender.com/api' });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('petmart_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;
