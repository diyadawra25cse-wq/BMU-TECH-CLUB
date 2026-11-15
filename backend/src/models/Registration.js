
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    enrollmentNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    eventName: {
      type: String,
      required: true,
      trim: true
    },
    aiInterests: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Performance index for student-specific queries and duplicate lookups
registrationSchema.index({ userId: 1, eventName: 1 });

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

module.exports = Registration;
