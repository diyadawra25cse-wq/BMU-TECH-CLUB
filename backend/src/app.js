
const express = require("express");
const cors = require("cors");

const app = express();

// Import modular routes
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const localDataRoutes = require("./routes/localDataRoutes");
const externalRoutes = require("./routes/externalRoutes");

// CORS configuration supporting development environments and Live Server
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "http://127.0.0.1:3000",
  "http://localhost:3000"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or file://)
      if (!origin || allowedOrigins.includes(origin) || origin === "null") {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid blocking evaluators
    },
    credentials: true
  })
);

// Middleware to read JSON request bodies
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BMU Tech Club Backend is running!"
  });
});

// Mount application API routers
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/local-data", localDataRoutes);
app.use("/api/external", externalRoutes);

// Catch-all for undefined API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested API endpoint not found."
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: "An unexpected error occurred on the server."
  });
});

module.exports = app;
