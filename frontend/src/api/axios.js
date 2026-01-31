// src/api/axios.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE + "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // refresh token cookie
});

// --------------------
// ACCESS TOKEN HELPERS
// --------------------
export function getAccessToken() {
  // ✅ FIX: use SAME key used everywhere else
  return localStorage.getItem("token");
}

export function setAccessToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// --------------------
// REQUEST INTERCEPTOR
// --------------------
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------
// REFRESH TOKEN INTERCEPTOR
// ----------------------------
let isRefreshing = false;
let subscribers = [];

function onNewToken(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(cb) {
  subscribers.push(cb);
}

api.interceptors.response.use(
  (res) => res,

  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((token) => {
            if (!token) return reject(err);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token");

        setAccessToken(newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        onNewToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        onNewToken(null);
        clearSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
