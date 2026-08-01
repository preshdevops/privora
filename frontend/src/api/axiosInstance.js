import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT access token for protected endpoints
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const isPublicAuthEndpoint = config.url?.includes('/api/users/login') ||
                                   config.url?.includes('/api/users/register') ||
                                   config.url?.includes('/api/users/token/refresh');
      if (!isPublicAuthEndpoint) {
        const storedTokens = localStorage.getItem('tokens');
        if (storedTokens) {
          const tokens = JSON.parse(storedTokens);
          if (tokens?.access) {
            config.headers.Authorization = `Bearer ${tokens.access}`;
          }
        }
      }
    } catch {
      // ignore parse error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor — handle 401 and automatic SimpleJWT token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt token refresh for login, register, or token refresh endpoints
    const isAuthEndpoint = originalRequest.url.includes('/api/users/login') ||
                          originalRequest.url.includes('/api/users/register') ||
                          originalRequest.url.includes('/api/users/token/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens) {
          throw new Error('No refresh token available');
        }

        const { refresh } = JSON.parse(storedTokens);
        if (!refresh) {
          throw new Error('No refresh token string');
        }

        // Call SimpleJWT refresh endpoint
        const res = await axios.post(`${baseURL}/api/users/token/refresh/`, { refresh });
        const newAccess = res.data.access;
        const newRefresh = res.data.refresh || refresh;

        const updatedTokens = { access: newAccess, refresh: newRefresh };
        localStorage.setItem('tokens', JSON.stringify(updatedTokens));

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

        processQueue(null, newAccess);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
