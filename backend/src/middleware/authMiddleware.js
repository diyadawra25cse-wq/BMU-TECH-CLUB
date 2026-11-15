
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify student authentication
const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in first."
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Valid token required."
      });
    }

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach student information to the request
    req.userId = decoded.userId;
    req.userRole = decoded.role;

    // Allow the request to continue
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
};

// Middleware to verify admin authorization using current database user record
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please log in first."
      });
    }

    // Query database directly to verify current role
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Administrative privileges required."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to verify administrative authorization."
    });
  }
};

authMiddleware.authMiddleware = authMiddleware;
authMiddleware.adminMiddleware = adminMiddleware;

module.exports = authMiddleware;
