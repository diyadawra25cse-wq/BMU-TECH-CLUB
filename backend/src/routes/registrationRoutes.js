
const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const {
  createRegistration,
  getMyRegistrations,
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration
} = require("../controllers/registrationController");

// Student-specific: Retrieve logged-in student's own registrations (registered before /:id)
router.get("/my", authMiddleware, getMyRegistrations);

// Authenticated: Submit a new registration
router.post("/", authMiddleware, createRegistration);

// Admin-only: Retrieve all registrations
router.get("/", authMiddleware, adminMiddleware, getRegistrations);

// Admin-only: Retrieve a single registration by ID
router.get("/:id", authMiddleware, adminMiddleware, getRegistrationById);

// Admin-only: Update registration with field whitelisting
router.put("/:id", authMiddleware, adminMiddleware, updateRegistration);

// Admin-only: Delete registration
router.delete("/:id", authMiddleware, adminMiddleware, deleteRegistration);

module.exports = router;
