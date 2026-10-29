import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('user');
    return hasToken && !hasUser;
  });

  // Setup axios default & background sync
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.data.token);
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  };

  const register = async (name, email, password, referralCode = '') => {
    const payload = { name, email, password };
    if (referralCode && referralCode.trim()) {
      payload.referralCode = referralCode.trim().toUpperCase();
    }
    const res = await api.post('/auth/register', payload);
    if (res.data.success) {
      setToken(res.data.data.token);
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
