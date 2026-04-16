import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authApi, clearAuthToken, getStoredToken, setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const savedToken = getStoredToken();

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
        setToken(savedToken);
      } catch (error) {
        clearAuthToken();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const applyAuth = ({ token: nextToken, user: nextUser }) => {
    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    applyAuth(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    applyAuth(data);
    return data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuthToken();
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
