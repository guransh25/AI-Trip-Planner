// src/routes/authRoutes.js
// Routes define URL endpoints and which controller function handles them
// Interview answer: "I separated routes and controllers for clean code —
//   routes are just the map, controllers are the actual logic"

const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/register → calls register function
router.post("/register", register);

// POST /api/auth/login → calls login function
router.post("/login", login);

module.exports = router;
