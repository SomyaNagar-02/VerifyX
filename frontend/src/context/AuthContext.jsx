import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// ─── Context Creation ──────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Helper: Safely decode JWT payload ────────────────────────────────────────
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// ─── Auth Provider ─────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // On mount — rehydrate auth state from localStorage
  useEffect(() => {
    const storedToken = authService.getToken();
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      // Check if token is still valid (not expired)
      if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(decoded);
        setIsAuthenticated(true);
      } else {
        // Token expired — clean up
        authService.logout();
      }
    }
    setIsInitialized(true);
  }, []);

  // Login: store token, decode user, update state
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    const storedToken = authService.getToken();
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      setToken(storedToken);
      setUser(decoded);
      setIsAuthenticated(true);
    }
    return data;
  }, []);

  // Signup: delegate to authService (no auto-login)
  const signup = useCallback(async (userData) => {
    const data = await authService.signup(userData);
    return data;
  }, []);

  // Logout: clear all auth state
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isInitialized,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
