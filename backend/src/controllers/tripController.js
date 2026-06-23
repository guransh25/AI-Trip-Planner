// src/controllers/tripController.js
// Handles: generating trips with AI, saving, fetching, and deleting trips
// Interview answer: "The AI call happens on the backend to protect my API key —
//   if I called it from the frontend, anyone could steal my key from the browser"

const Anthropic = require("@anthropic-ai/sdk");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Initialize Anthropic client — uses ANTHROPIC_API_KEY from .env automatically
const anthropic = new Anthropic();

// ─── GENERATE TRIP ────────────────────────────────────────────────────────────
// POST /api/trips/generate
// Protected route — user must be logged in
const generateTrip = async (req, res) => {
  try {
    const { destination, days, budget, travelStyle } = req.body;

    // req.user is set by the authMiddleware (contains id, email, name)
    const userId = req.user.id;

    // Validate required fields
    if (!destination || !days || !budget || !travelStyle) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ── CALL CLAUDE API ──────────────────────────────────────────────────────
    // This is the core AI feature of the app
    // Interview answer: "I send a structured prompt to Claude's API and get back
    //   a detailed itinerary. The prompt is engineered to return a consistent format"
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",   // Using Sonnet for speed + quality balance
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Create a detailed ${days}-day trip itinerary for ${destination}.
          
Budget level: ${budget} (budget = cheap eats & hostels, moderate = mid-range, luxury = high-end)
Travel style: ${travelStyle} (adventure, cultural, relaxation, foodie, family)

Format the response as follows for EACH day:
**Day [number]: [Theme for the day]**
- Morning: [activity with brief description]
- Afternoon: [activity with brief description]  
- Evening: [activity with restaurant recommendation]
- Tip: [one local insider tip]

After all days, add a **Practical Info** section with:
- Best time to visit
- Getting around
- Must-pack items
- Estimated daily budget in USD

Keep it practical, specific, and exciting!`,
        },
      ],
    });

    // Extract the text from Claude's response
    // message.content is an array — we want the first text block
    const itinerary = message.content[0].text;

    // ── SAVE TO DATABASE ─────────────────────────────────────────────────────
    // Save the generated trip so users can view it later
    const trip = await prisma.trip.create({
      data: {
        destination,
        days: parseInt(days),
        budget,
        travelStyle,
        itinerary,
        userId, // links this trip to the logged-in user
      },
    });

    // Return the saved trip (includes the id assigned by the DB)
    res.status(201).json(trip);
  } catch (error) {
    console.error("Generate trip error:", error);
    res.status(500).json({ message: "Failed to generate trip" });
  }
};

// ─── GET ALL USER'S TRIPS ──────────────────────────────────────────────────────
// GET /api/trips
// Returns all trips belonging to the logged-in user (from JWT)
const getMyTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    // Prisma query: find all trips WHERE userId matches
    // orderBy: newest first
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      // Select only the fields we need (no need to return full itinerary in the list)
      select: {
        id: true,
        destination: true,
        days: true,
        budget: true,
        travelStyle: true,
        createdAt: true,
        // Don't include itinerary here — it's fetched separately when user clicks a trip
      },
    });

    res.json(trips);
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
};

// ─── GET A SINGLE TRIP ────────────────────────────────────────────────────────
// GET /api/trips/:id
// Returns full details including the itinerary
const getTripById = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id); // URL param e.g. /api/trips/3
    const userId = req.user.id;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    // Trip not found
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Security check: make sure this trip belongs to the requesting user
    // Prevents user A from viewing user B's trips by guessing IDs
    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to view this trip" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

// ─── DELETE A TRIP ────────────────────────────────────────────────────────────
// DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const userId = req.user.id;

    // Find the trip first to verify ownership
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    // Delete from database
    await prisma.trip.delete({ where: { id: tripId } });

    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};

module.exports = { generateTrip, getMyTrips, getTripById, deleteTrip };
