const mongoose = require("mongoose");

/**
 * Connects the app to MongoDB.
 * Why: Mongoose needs an active connection before models can read/write data.
 */
async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to backend/.env");
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

module.exports = connectDB;
