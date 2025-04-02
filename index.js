const express = require('express');
const app = express();
app.use(express.json());

// Mock user database
const users = [
  {
    email: "test@example.com",
    password: "password123"
  }
];

// Rate limiting storage
const loginAttempts = new Map();

// Rate limiting middleware
function rateLimitLogin(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  const attempts = loginAttempts.get(ip) || [];
  const recentAttempts = attempts.filter(timestamp => timestamp > oneMinuteAgo);

  if (recentAttempts.length >= 5) {
    return res.status(429).json({ error: "Too many login attempts. Try again later." });
  }

  loginAttempts.set(ip, [...recentAttempts, now]);
  next();
}

// Login endpoint
app.post('/login', rateLimitLogin, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return res.json({ success: true, token: "JWT_TOKEN" });
  }

  res.status(400).json({ error: "Invalid credentials" });
});

module.exports = { app };