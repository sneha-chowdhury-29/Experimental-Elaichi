import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Axios interceptor to add auth token to all requests
const api = axios.create({ baseURL: BACKEND_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(false);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('access_token');
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email, password }
      );
      localStorage.setItem('access_token', response.data.access_token);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: formatApiErrorDetail(error.response?.data?.detail) || error.message
      };
    }
  };

  const logout = async () => {
    localStorage.removeItem('access_token');
    setUser(false);
  };

  const formatApiErrorDetail = (detail) => {
    if (detail == null) return "Something went wrong. Please try again.";
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail))
      return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
    if (detail && typeof detail.msg === "string") return detail.msg;
    return String(detail);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
