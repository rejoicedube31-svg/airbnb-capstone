require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");

/**
 * Day 3: start the API server and connect to MongoDB.
 * Why: React apps (client/admin) will call this server — not the database directly.
 */
async function startServer() {
  await connectDB(process.env.MONGODB_URI);

  const app = express();

  // Parse JSON bodies — needed later for POST /api/users/login, listings, etc.
  app.use(express.json());

  // Health check — quick way to verify the API is running.
  app.get("/api/health", (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;

    res.status(200).json({
      success: true,
      message: "API is running",
      database: dbConnected ? "connected" : "disconnected",
    });
  });

  app.use("/api/users", userRoutes);
  app.use("/api/accommodations", accommodationRoutes);

  // 404 — no matching route
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Errors passed with next(err) from routes/controllers land here
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
