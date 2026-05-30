import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sportstore_token';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const user = useMemo(() => {
    const payload = token ? parseJwt(token) : null;
    if (!payload) return null;

    return {
      username: payload.sub,
      role: payload.role,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null
    };
  }, [token]);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  async function login(credentials) {
    const response = await api.login(credentials);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
  }

  async function register(credentials) {
    const response = await api.register({ ...credentials, role: 'ROLE_USER' });
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, isAdmin, isAuthenticated: Boolean(token), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
