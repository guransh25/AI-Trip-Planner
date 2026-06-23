// src/index.js
// This is the ENTRY POINT of your backend — it starts the server
// Interview answer: "Express is a Node.js framework that makes it easy to build REST APIs"

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import your route files
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

// Create the Express app
const app = express();

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches your routes
// Think of it as a security checkpoint

// CORS — allows your React frontend (different port) to call this backend
// Without this, the browser blocks cross-origin requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite's default port
    credentials: true,
  })
);

// Parse incoming JSON request bodies
// Without this, req.body would be undefined
app.use(express.json());

// ─── ROUTES ────────────────────────────────────────────────────────────────────
// Mount routes at specific URL prefixes
// All auth routes → /api/auth/...
// All trip routes → /api/trips/...
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Health check route — useful to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "Trip Planner API is running ✈️" });
});

// ─── START SERVER ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
