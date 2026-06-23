// src/context/AuthContext.jsx
// Context provides GLOBAL STATE that any component can access
// Interview answer: "Instead of passing user data through props at every level
//   (prop drilling), React Context lets any component access auth state directly"

import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

// 1. CREATE the context
const AuthContext = createContext(null);

// 2. PROVIDER wraps the app and holds the state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // logged-in user object
  const [token, setToken] = useState(null);     // JWT token
  const [loading, setLoading] = useState(true); // checking localStorage on load

  // On first load, check if user was already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // done checking
  }, []);

  // LOGIN — called after successful login API response
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    // Persist to localStorage so user stays logged in on refresh
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // LOGOUT — clears everything
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Value is what any component can access via useAuth()
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isLoggedIn: !!user, // convert to boolean
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. CUSTOM HOOK — clean way to use the context
// Instead of: const { user } = useContext(AuthContext)
// Usage:       const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
