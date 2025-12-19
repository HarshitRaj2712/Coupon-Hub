// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

// adjust to your backend URL
const API_BASE = import.meta.env.VITE_API_BASE;


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: load token + user from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      axios.defaults.baseURL = API_BASE;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else {
      axios.defaults.baseURL = API_BASE;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore parse errors
      }
    }

    setLoading(false);
  }, []);

  // login: call /api/auth/login, store accessToken as "token"
  const login = async ({ email, password }) => {
    const res = await axios.post(
      `${API_BASE}/auth/login`,
      { email, password },
      { withCredentials: true } // so refresh cookie is set
    );

    const { accessToken, user: userPayload } = res.data;

    setToken(accessToken);
    setUser(userPayload);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userPayload));

    axios.defaults.baseURL = API_BASE;
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  // signup: same pattern as login
  const signup = async ({ name, email, password }) => {
    const res = await axios.post(
      `${API_BASE}/auth/signup`,
      { name, email, password },
      { withCredentials: true }
    );

    const { accessToken, user: userPayload } = res.data;

    setToken(accessToken);
    setUser(userPayload);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userPayload));

    axios.defaults.baseURL = API_BASE;
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, null, { withCredentials: true });
    } catch (e) {
      // ignore network errors on logout
    }

    setUser(null);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
