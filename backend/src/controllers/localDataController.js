
const fs = require("node:fs/promises");
const path = require("node:path");

const EVENTS_FILE_PATH = path.join(__dirname, "../data/events.json");
const TEAM_FILE_PATH = path.join(__dirname, "../data/team.json");

// Helper to safely read JSON files
const readJsonFile = async (filePath) => {
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
};

const writeEventsToFile = async (events) => {
  await fs.mkdir(path.dirname(EVENTS_FILE_PATH), { recursive: true });
  await fs.writeFile(EVENTS_FILE_PATH, JSON.stringify(events, null, 2), "utf-8");
};

// GET all local events from JSON file (Managed by Ojas)
const getLocalEvents = async (req, res) => {
  try {
    const events = (await readJsonFile(EVENTS_FILE_PATH)) || [];
    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error("Error reading local events JSON:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve local events data."
    });
  }
};

// GET a single local event from JSON file by ID
const getLocalEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const events = (await readJsonFile(EVENTS_FILE_PATH)) || [];
    const event = events.find(e => String(e.id) === String(id));

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found in local JSON data."
      });
    }

    return res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error("Error reading event by ID from JSON:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve local event details."
    });
  }
};

// POST a new event to local JSON file (Administrative action)
const saveLocalEvent = async (req, res) => {
  try {
    const { title, date, displayDate, time, venue, description, category, capacity } = req.body;

    if (!title || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: "Please provide event title, date, and venue."
      });
    }

    const events = (await readJsonFile(EVENTS_FILE_PATH)) || [];

    const id = req.body.id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const existingIndex = events.findIndex(e => e.id === id);
    if (existingIndex !== -1) {
      return res.status(409).json({
        success: false,
        message: "An event with this ID already exists in local JSON data."
      });
    }

    const newEvent = {
      id,
      title: title.trim(),
      date: date.trim(),
      displayDate: displayDate ? displayDate.trim() : date.trim(),
      time: time ? time.trim() : "TBA",
      venue: venue.trim(),
      description: description ? description.trim() : "",
      category: category ? category.trim() : "General",
      capacity: capacity ? Number(capacity) : 100,
      createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    await writeEventsToFile(events);

    return res.status(201).json({
      success: true,
      message: "Event saved to local JSON data successfully!",
      data: newEvent
    });

  } catch (error) {
    console.error("Error saving to local events JSON:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to save event to local JSON data."
    });
  }
};

// GET team members from local JSON file (Managed by Ojas)
const getLocalTeam = async (req, res) => {
  try {
    const team = await readJsonFile(TEAM_FILE_PATH);

    if (!team) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: "Team dataset is ready for Ojas to populate in backend/src/data/team.json"
      });
    }

    return res.status(200).json({
      success: true,
      count: team.length,
      data: team
    });
  } catch (error) {
    console.error("Error reading local team JSON:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve team members data."
    });
  }
};

module.exports = {
  getLocalEvents,
  getLocalEventById,
  saveLocalEvent,
  getLocalTeam
};
