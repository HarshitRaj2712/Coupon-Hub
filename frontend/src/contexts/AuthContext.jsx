// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const nav = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      // server sets httpOnly refresh cookie; returns accessToken + user
      const { accessToken } = res.data;
      if (!accessToken) throw new Error('Signup failed: no access token returned');
      // store access token + do not store refresh token (cookie)
      localStorage.setItem('accessToken', accessToken);
      // optionally you can set user, but we redirect to login so we don't auto-login
      toast.success('Account created successfully — please login');
      nav('/login');
      return res.data;
    } catch (err) {
      // bubble up so Signup page can show the error too
      const message = err?.response?.data?.message || err.message || 'Signup failed';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user: u } = res.data;
      if (!accessToken) throw new Error('Login failed: no access token returned');
      localStorage.setItem('accessToken', accessToken);
      setUser(u);
      toast.success(`Welcome, ${u?.name || u?.email}`);
      nav('/'); // go to home or dashboard
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // server will clear refresh cookie and revoke token
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      toast.success('Logged out');
      nav('/login');
    }
  };

  // restore session silently on startup (server uses cookie)
  const tryRestoreSession = async () => {
    try {
      const res = await api.post('/auth/refresh', {}); // cookie sent automatically
      const newAccessToken = res.data?.accessToken;
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } else {
        localStorage.removeItem('accessToken');
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  useEffect(() => {
    tryRestoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
