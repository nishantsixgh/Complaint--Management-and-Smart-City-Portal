import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axiosInstance.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "smartCityToken";
const USER_KEY = "smartCityUser";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const saveSession = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post("/auth/register", payload);
      saveSession(data);
      return data;
    },
    [saveSession]
  );

  const login = useCallback(
    async (payload) => {
      const { data } = await api.post("/auth/login", payload);
      saveSession(data);
      return data;
    },
    [saveSession]
  );

  const refreshProfile = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem(TOKEN_KEY)) {
        await api.post("/auth/logout");
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch (_error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [clearSession, refreshProfile, token]);

  useEffect(() => {
    const handleAuthExpired = () => {
      clearSession();
    };

    window.addEventListener("smart-city-auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("smart-city-auth-expired", handleAuthExpired);
    };
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      register,
      login,
      logout,
      refreshProfile,
      isAuthenticated: Boolean(token && user)
    }),
    [loading, login, logout, refreshProfile, register, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
