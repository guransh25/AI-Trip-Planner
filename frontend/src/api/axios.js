// src/api/axios.js
// Creating a custom axios instance with the base URL pre-set
// Interview answer: "I created a custom axios instance so I don't have to 
//   repeat the base URL in every API call, and I can add the auth token globally"

import axios from "axios";

const api = axios.create({
  // All requests will be prefixed with this URL
  // In production, change this to your Railway backend URL
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// INTERCEPTOR — runs before every request
// Automatically attaches the JWT token to every request
// Interview answer: "Instead of manually adding the token to every call,
//   I use an axios interceptor to add it automatically"
api.interceptors.request.use((config) => {
  // Get token from localStorage (where we store it after login)
  const token = localStorage.getItem("token");
  if (token) {
    // Add it as a Bearer token in the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
