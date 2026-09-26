import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agrilink_token');
    const savedUser = localStorage.getItem('agrilink_user');
    
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed); // Immediately set cached user from localStorage on refresh
        
        // Verify token in background
        api.getMe()
          .then(userData => {
            setUser(userData);
            localStorage.setItem('agrilink_user', JSON.stringify(userData));
          })
          .catch(err => {
            // Only log out if credentials explicitly failed (401 Unauthorized)
            if (err.message && err.message.includes('401') || err.message.includes('Could not validate')) {
              logout();
            } else {
              console.log('Backend connection warning on refresh, keeping cached user session:', err.message);
            }
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('agrilink_token', data.access_token);
    localStorage.setItem('agrilink_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    localStorage.setItem('agrilink_token', data.access_token);
    localStorage.setItem('agrilink_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
