import axios from 'axios';
import mockAdapter from './mock/adapter';

const SERVER = import.meta.env.VITE_SERVER_URL || '';
const api = axios.create({ baseURL: `${SERVER}/api`, adapter: mockAdapter });

let onAuthFail = () => {};
export const setAuthFailHandler = (fn) => { onAuthFail = fn; };

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || '';
    if (error.response?.status === 401 && !url.includes('/auth/login') && localStorage.getItem('token')) onAuthFail();
    return Promise.reject(error);
  }
);

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';
export const img = (path) => `${SERVER}${path}`;
export default api;
