// src/routes/tripRoutes.js
// All trip routes are PROTECTED — user must send a valid JWT token
// The `protect` middleware runs BEFORE the controller on every route here

const express = require("express");
const {
  generateTrip,
  getMyTrips,
  getTripById,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// protect is passed as middleware BEFORE the controller
// Express runs them left to right: protect → then controller

// POST /api/trips/generate → generate a new AI trip
router.post("/generate", protect, generateTrip);

// GET /api/trips → get all trips for logged-in user
router.get("/", protect, getMyTrips);

// GET /api/trips/:id → get a single trip by ID
router.get("/:id", protect, getTripById);

// DELETE /api/trips/:id → delete a trip
router.delete("/:id", protect, deleteTrip);

module.exports = router;
