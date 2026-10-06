import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Interceptor para adjuntar el JWT en cada petición
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para capturar error 401 y redirigir al login
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;