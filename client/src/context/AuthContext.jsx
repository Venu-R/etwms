import { createContext, useContext, useState } from 'react';
import { loginApi, registerApi } from '../api/index';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('etwms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('etwms_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await loginApi(email, password, role);
      const { token: newToken, user: newUser } = res.data.data;
      localStorage.setItem('etwms_token', newToken);
      localStorage.setItem('etwms_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true, role: newUser.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('etwms_token');
    localStorage.removeItem('etwms_user');
    setToken(null);
    setUser(null);
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      await registerApi(payload);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Sign up failed',
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
