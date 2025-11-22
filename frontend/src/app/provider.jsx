// src/app/provider.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dummy login
  const login = async ({ email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500)); // simulate API call
    if (email && password) {
      setUser({ name: email.split('@')[0], email });
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false };
  };

  // Dummy signup
  const signup = async ({ name, email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (email && password && name) {
      setUser({ name, email });
      setLoading(false);
      return { success: true };
    }
    setLoading(false);
    return { success: false };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
