
const mongoose = require("mongoose");
const Registration = require("../models/Registration");
const User = require("../models/User");

// CREATE a new event registration for the authenticated student
const createRegistration = async (req, res) => {
  try {
    // Get the logged-in user's details using their verified JWT
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    const { eventName, aiInterests } = req.body;

    if (!eventName || typeof eventName !== "string" || !eventName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please specify a valid event name."
      });
    }

    const cleanEventName = eventName.trim();

    // Check whether this user has already registered for this event
    const existingRegistration = await Registration.findOne({
      userId: user._id,
      eventName: cleanEventName
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event."
      });
    }

    // Create registration using authenticated account details to prevent spoofing
    const registration = await Registration.create({
      userId: user._id,
      fullName: user.fullName,
      enrollmentNumber: user.enrollmentNumber,
      email: user.email,
      phoneNumber: user.phoneNumber,
      course: user.course,
      eventName: cleanEventName,
      aiInterests: Array.isArray(aiInterests) ? aiInterests : []
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully!",
      data: registration
    });

  } catch (error) {
    console.error("Create registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to process event registration."
    });
  }
};

// READ only the logged-in student's own registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error("Get my registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your registrations."
    });
  }
};

// READ all registrations (Administrative access only)
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });

  } catch (error) {
    console.error("Get all registrations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve registrations."
    });
  }
};

// READ one registration by ID (Administrative access only)
const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format."
      });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error("Get registration by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve registration."
    });
  }
};

// UPDATE a registration by ID (Administrative access only, with field whitelisting)
const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format."
      });
    }

    // Whitelist allowable fields to prevent overwriting userId or internal fields
    const allowedFields = [
      "fullName",
      "enrollmentNumber",
      "email",
      "phoneNumber",
      "course",
      "eventName",
      "aiInterests"
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update."
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration updated successfully!",
      data: registration
    });

  } catch (error) {
    console.error("Update registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to update registration."
    });
  }
};

// DELETE a registration by ID (Administrative access only)
const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration ID format."
      });
    }

    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration deleted successfully!"
    });

  } catch (error) {
    console.error("Delete registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete registration."
    });
  }
};

module.exports = {
  createRegistration,
  getMyRegistrations,
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration
};
