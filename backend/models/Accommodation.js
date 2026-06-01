const mongoose = require("mongoose");

const specificRatingsSchema = new mongoose.Schema(
  {
    cleanliness: { type: Number, min: 0, max: 5 },
    communication: { type: Number, min: 0, max: 5 },
    checkIn: { type: Number, min: 0, max: 5 },
    accuracy: { type: Number, min: 0, max: 5 },
    location: { type: Number, min: 0, max: 5 },
    value: { type: Number, min: 0, max: 5 },
  },
  { _id: false }
);

/**
 * Accommodation — a property listing (what guests browse and hosts manage).
 * Why: Matches the brief’s listing shape and admin create/update form fields.
 */
const accommodationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    guests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    amenities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    price: { type: Number, required: true, min: 0 },
    weeklyDiscount: { type: Number, default: 0, min: 0 },
    cleaningFee: { type: Number, default: 0, min: 0 },
    serviceFee: { type: Number, default: 0, min: 0 },
    occupancyTaxes: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    host: { type: String, required: true, trim: true },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enhancedCleaning: { type: Boolean, default: false },
    selfCheckIn: { type: Boolean, default: false },
    specificRatings: specificRatingsSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Accommodation", accommodationSchema);
