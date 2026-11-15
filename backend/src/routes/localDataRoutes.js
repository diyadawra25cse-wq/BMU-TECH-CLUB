
const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const {
  getLocalEvents,
  getLocalEventById,
  saveLocalEvent,
  getLocalTeam
} = require("../controllers/localDataController");

// Public access: Fetch all events from local JSON file
router.get("/events", getLocalEvents);

// Public access: Fetch single event by ID from local JSON file
router.get("/events/:id", getLocalEventById);

// Administrative access: Save new event into local JSON file
router.post("/events", authMiddleware, adminMiddleware, saveLocalEvent);

// Public access: Fetch club team members from local JSON file (Ojas's ownership)
router.get("/team", getLocalTeam);

module.exports = router;
