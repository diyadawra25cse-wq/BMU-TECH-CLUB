
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new student account
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      enrollmentNumber,
      email,
      password,
      phoneNumber,
      course,
      year,
      interest
    } = req.body;

    // Check whether all required fields are provided
    if (
      !fullName ||
      !enrollmentNumber ||
      !email ||
      !password ||
      !phoneNumber ||
      !course ||
      !year
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanEnrollment = enrollmentNumber.trim();

    // Check whether the email or enrollment number already exists
    const existingUser = await User.findOne({
      $or: [
        { email: cleanEmail },
        { enrollmentNumber: cleanEnrollment }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or enrollment number already exists."
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the student account - role is explicitly forced to "student" for public signup
    const user = await User.create({
      fullName: fullName.trim(),
      enrollmentNumber: cleanEnrollment,
      email: cleanEmail,
      password: hashedPassword,
      phoneNumber: phoneNumber.trim(),
      course: course.trim(),
      year: String(year).trim(),
      interest: interest ? interest.trim() : "",
      role: "student"
    });

    // Generate an authentication token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Student account created successfully!",
      token,
      data: {
        id: user._id,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        email: user.email,
        phoneNumber: user.phoneNumber,
        course: user.course,
        year: user.year,
        interest: user.interest,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email or enrollment number already exists."
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to create account."
    });
  }
};

// Login an existing student
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check whether email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password."
      });
    }

    // Find the student using their email
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Compare entered password with stored password hash
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate authentication token with user role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      data: {
        id: user._id,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        email: user.email,
        phoneNumber: user.phoneNumber,
        course: user.course,
        year: user.year,
        interest: user.interest,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to log in."
    });
  }
};

// Get currently logged-in student's details
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student account not found."
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        enrollmentNumber: user.enrollmentNumber,
        email: user.email,
        phoneNumber: user.phoneNumber,
        course: user.course,
        year: user.year,
        interest: user.interest,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Get current user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch student details."
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
