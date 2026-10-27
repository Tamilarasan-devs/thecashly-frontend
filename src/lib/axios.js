import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  baseURL: import.meta.env.VITE_API_URL || 'https://thecashly-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
      const isAuthPage = typeof window !== 'undefined' && 
        (window.location.pathname === '/login' || window.location.pathname === '/register');

      // Only clear token and redirect if it's NOT an authentication request and not already on the auth pages
      // This prevents unwanted page reload/refresh when entering invalid credentials on the login page
      if (!isAuthEndpoint && !isAuthPage) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
