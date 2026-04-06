const jwt = require("jsonwebtoken");

const User = require("../models/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email
  };
}

function normalizeCredentials(body = {}) {
  return {
    name: (body.name || "").trim(),
    email: (body.email || "").trim().toLowerCase(),
    password: body.password || ""
  };
}

async function register(req, res) {
  const { name, email, password } = normalizeCredentials(req.body);

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = await User.create({ name, email, password });
  const token = createToken(user._id.toString());

  res.status(201).json({
    message: "Registration successful.",
    token,
    user: sanitizeUser(user)
  });
}

async function login(req, res) {
  const { email, password } = normalizeCredentials(req.body);

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = createToken(user._id.toString());

  res.json({
    message: "Login successful.",
    token,
    user: sanitizeUser(user)
  });
}

async function logout(req, res) {
  res.json({ message: "Logout successful." });
}

async function getCurrentUser(req, res) {
  res.json({ user: sanitizeUser(req.user) });
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
