import React, { createContext, useEffect, useState } from "react";
import api, { setAccessToken, clearSession } from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setAccessToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }

    setLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    const res = await api.post(
      "/auth/login",   // ✅ NO /api here
      { email, password },
      { withCredentials: true }
    );

    const { accessToken, user: userPayload } = res.data;

    setToken(accessToken);
    setUser(userPayload);
    setAccessToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userPayload));
  };

  const signup = async ({ name, email, password }) => {
    const res = await api.post(
      "/auth/signup",  // ✅ NO /api here
      { name, email, password },
      { withCredentials: true }
    );

    const { accessToken, user: userPayload } = res.data;

    setToken(accessToken);
    setUser(userPayload);
    setAccessToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userPayload));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", null, { withCredentials: true });
    } catch {}

    setUser(null);
    setToken(null);
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
