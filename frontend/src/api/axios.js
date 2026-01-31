// src/api/axios.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE + '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // IMPORTANT: allows sending/receiving cookies (refresh token)
});

// --------------------
// ACCESS TOKEN HELPERS
// --------------------
export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function setAccessToken(token) {
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
}

export function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----------------------------
// REFRESH TOKEN INTERCEPTOR
// ----------------------------
let isRefreshing = false;
let subscribers = [];

function onNewToken(token) {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

api.interceptors.response.use(
  res => res,

  async (err) => {
    const originalRequest = err.config;

    if (!originalRequest) return Promise.reject(err);

    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If refresh is already happening → queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((token) => {
            if (!token) return reject(new Error("Failed to refresh token"));
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      // Start refresh
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token received");

        setAccessToken(newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        onNewToken(newAccessToken);

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        onNewToken(null);        // notify listeners that refresh failed
        clearSession();          // clear local session
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
