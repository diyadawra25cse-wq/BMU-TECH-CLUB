
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/profile", authMiddleware, getCurrentUser);

module.exports = router;
