import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Helper to fetch profile using a given token
  const fetchProfile = async (token) => {
    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      throw err;
    }
  };

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, accessToken: token } = response.data.data;
      setAccessToken(token);
      setUser(userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed';
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API failed, clearing local state anyway', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // Silent refresh on initial app load
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const response = await api.post('/auth/refresh');
        const token = response.data.data.accessToken;
        setAccessToken(token);
        
        // Fetch user profile with this token
        const userData = await fetchProfile(token);
        setUser(userData);
      } catch (err) {
        console.log('No active session found (silent refresh skipped)');
      } finally {
        setIsLoading(false);
      }
    };
    silentRefresh();
  }, []);

  // Sockets lifecycle hook
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('🔌 Realtime Socket Connected:', newSocket.id);
      newSocket.emit('join', { userId: user._id || user.id, role: user.role });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Request interceptor: attach dynamic authorization token
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
    };
  }, [accessToken]);

  // Response interceptor: automatically refresh token on 401
  useEffect(() => {
    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Avoid infinite loop if refresh itself fails or request has already been retried
        if (
          error.response?.status === 401 && 
          !originalRequest._retry && 
          originalRequest.url !== '/auth/refresh' &&
          originalRequest.url !== '/auth/login'
        ) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await api.post('/auth/refresh');
            const newAccessToken = refreshResponse.data.data.accessToken;
            setAccessToken(newAccessToken);
            
            // Retry the original request with new token
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshErr) {
            // Refresh failed — clear auth state and trigger redirect/logout state
            setAccessToken(null);
            setUser(null);
            return Promise.reject(refreshErr);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, isLoading, setUser, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
