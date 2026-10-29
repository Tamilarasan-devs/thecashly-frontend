import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-Memory API Cache & In-Flight Deduplication for Instant UI Rendering
const apiCache = new Map();
const inFlightRequests = new Map();
const DEFAULT_CACHE_TTL_MS = 25000; // 25 seconds

// Read-heavy routes that benefit from short-lived client caching
const CACHEABLE_ROUTES = [
  '/plans',
  '/payment-settings',
  '/auth/referral-stats'
];

export const clearApiCache = (pattern = '') => {
  if (!pattern) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
};

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

// Response interceptor to handle global 401 Unauthorized errors and cache invalidation
api.interceptors.response.use(
  (response) => {
    // Invalidate relevant cache on mutations
    const method = response.config?.method?.toLowerCase();
    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      const url = response.config?.url || '';
      if (url.includes('/plans') || url.includes('/payments/purchase')) {
        clearApiCache('/plans');
      }
      if (url.includes('/payment-settings') || url.includes('/topups')) {
        clearApiCache('/payment-settings');
      }
      if (url.includes('/auth')) {
        clearApiCache('/auth');
      }
    }
    return response;
  },
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

// Wrap api.get with in-flight deduplication and intelligent short-lived cache
const originalGet = api.get.bind(api);
api.get = function (url, config = {}) {
  const isCacheable = config.cache !== false && CACHEABLE_ROUTES.some((route) => url.startsWith(route));

  if (!isCacheable) {
    return originalGet(url, config);
  }

  const cacheKey = `${url}:${JSON.stringify(config.params || {})}`;
  const cached = apiCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < (config.ttl || DEFAULT_CACHE_TTL_MS)) {
    // Return cached response instantly (0ms)
    return Promise.resolve({ ...cached.response, fromCache: true });
  }

  // Deduplicate in-flight requests
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const requestPromise = originalGet(url, config)
    .then((response) => {
      apiCache.set(cacheKey, {
        response,
        timestamp: Date.now()
      });
      inFlightRequests.delete(cacheKey);
      return response;
    })
    .catch((err) => {
      inFlightRequests.delete(cacheKey);
      throw err;
    });

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

export default api;
