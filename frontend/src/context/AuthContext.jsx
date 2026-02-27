import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

const roleRedirectPath = (role) => {
  if (role === "student") return "/student/dashboard";
  if (role === "tutor") return "/tutor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    try {
      // ✅ match your backend endpoint
      const { data } = await api.post("/auth/login", { email, password });

      // Expecting: { token, user }
      setToken(data.token);
      setUser(data.user);

      return { success: true, redirectTo: roleRedirectPath(data.user?.role) };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed";
      return { success: false, message: msg };
    }
  };

  const register = async (payload) => {
    try {
      // ✅ match your backend endpoint
      const { data } = await api.post("/auth/register", payload);

      // Expecting: { token, user }
      setToken(data.token);
      setUser(data.user);

      return { success: true, redirectTo: roleRedirectPath(data.user?.role) };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed";
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, isAuth: !!token, login, register, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);