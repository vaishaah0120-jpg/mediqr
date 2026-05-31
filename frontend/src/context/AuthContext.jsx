import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mediqr_token') || null);
  const [loading, setLoading] = useState(true);

  // Set API base URL
  const API_URL = 'http://localhost:5000/api';

  // Check current session on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        // Fallback for network loss during development, keep local session if token exists
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('mediqr_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed. Please verify credentials.',
        };
      }
    } catch (error) {
      console.error('Login request error:', error);
      return {
        success: false,
        message: 'Could not connect to the authentication server. Ensure the backend is running.',
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('mediqr_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
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
