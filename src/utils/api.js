import axios from 'axios';

const api = axios.create({ baseURL: "https://petshop-backend-dx9u.onrender.com/api" });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('petmart_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;
