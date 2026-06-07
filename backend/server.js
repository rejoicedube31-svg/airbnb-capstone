require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const accommodationRoutes = require("./routes/accommodationRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

/**
 * Day 3: start the API server and connect to MongoDB.
 * Why: React apps (client/admin) will call this server — not the database directly.
 */
async function startServer() {
  await connectDB(process.env.MONGODB_URI);

  const app = express();

  // CORS — open in dev; restrict to React URLs in production via .env
  const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean);
  app.use(
    cors(
      allowedOrigins.length > 0
        ? { origin: allowedOrigins }
        : undefined
    )
  );

  // Parse JSON bodies — needed later for POST /api/users/login, listings, etc.
  app.use(express.json());

  // Serve uploaded images so browser can show /uploads/filename.jpg
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  app.use("/api/reservations", reservationRoutes);

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
