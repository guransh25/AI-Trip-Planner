// src/middleware/authMiddleware.js
// MIDDLEWARE that protects routes — checks if user is logged in
// Interview answer: "Middleware sits between the request and route handler.
//   I use it to verify JWT tokens before allowing access to protected routes."

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // 1. Get the token from the Authorization header
  //    Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers.authorization;

  // If no header sent at all → reject
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. No token." });
  }

  // Extract just the token part (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 2. VERIFY the token using your secret key
    //    If the token was tampered with or expired → this throws an error
    //    Interview answer: "jwt.verify decodes and validates the signature"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user data to the request object
    //    Now any route that uses this middleware can access req.user
    req.user = decoded; // contains { id, email, name }

    // 4. Call next() to pass control to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized. Invalid token." });
  }
};

module.exports = { protect };
