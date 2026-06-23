// src/controllers/authController.js
// CONTROLLERS contain the actual business logic for each route
// Interview answer: "I separated logic into controllers to keep routes clean — 
//   routes just define the path, controllers handle what happens"

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

// PrismaClient is your database connection
// It's created once and reused (singleton pattern)
const prisma = new PrismaClient();

// ─── HELPER: Generate JWT Token ───────────────────────────────────────────────
// A JWT has 3 parts: Header.Payload.Signature
// Payload stores user data (id, email) — never store passwords here!
// Signature ensures nobody tampered with the token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name }, // payload
    process.env.JWT_SECRET,                               // secret key
    { expiresIn: "7d" }                                   // token expires in 7 days
  );
};

// ─── REGISTER ─────────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. HASH the password before saving
    //    bcrypt adds a "salt" (random data) to the hash to prevent rainbow table attacks
    //    Interview answer: "I hash passwords with bcrypt so even if DB is breached, 
    //      passwords can't be read. Salt means same password → different hash each time"
    const salt = await bcrypt.genSalt(10); // 10 = work factor (higher = slower = safer)
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // NEVER store plain text password
      },
    });

    // 5. Generate JWT and return it
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Vague error on purpose — don't tell attacker if email exists
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare submitted password with stored hash
    //    bcrypt.compare hashes the input and compares — it's not decrypting!
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT and return it
    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { register, login };
