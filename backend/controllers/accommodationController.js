const Accommodation = require("../models/Accommodation");

const REQUIRED_FIELDS = [
  "title",
  "description",
  "type",
  "location",
  "guests",
  "bedrooms",
  "bathrooms",
  "price",
];

/**
 * GET /api/accommodations
 * Optional query: ?location=Centurion
 * Why: Public site lists properties; location filter matches the Location Page brief.
 */
async function getAllAccommodations(req, res) {
  const filter = {};

  if (req.query.location) {
    filter.location = { $regex: req.query.location.trim(), $options: "i" };
  }

  const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: accommodations.length,
    data: accommodations,
  });
}

/**
 * POST /api/accommodations
 * Why: Hosts create listings from the admin dashboard (JWT required).
 */
async function createAccommodation(req, res, next) {
  if (req.user.role !== "host") {
    return res.status(403).json({
      success: false,
      message: "Only hosts can create listings",
    });
  }

  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(", ")}`,
    });
  }

  const {
    title,
    description,
    type,
    location,
    guests,
    bedrooms,
    bathrooms,
    price,
    amenities = [],
    images = [],
    weeklyDiscount = 0,
    cleaningFee = 0,
    serviceFee = 0,
    occupancyTaxes = 0,
    rating = 0,
    reviews = 0,
    enhancedCleaning = false,
    selfCheckIn = false,
    specificRatings,
  } = req.body;

  if (Number(guests) < 1 || Number(price) < 0) {
    return res.status(400).json({
      success: false,
      message: "Guests must be at least 1 and price cannot be negative",
    });
  }

  try {
    const accommodation = await Accommodation.create({
      title,
      description,
      type,
      location,
      guests,
      bedrooms,
      bathrooms,
      price,
      amenities,
      images,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      rating,
      reviews,
      host: req.user.username,
      hostId: req.user.userId,
      enhancedCleaning,
      selfCheckIn,
      specificRatings,
    });

    res.status(201).json({
      success: true,
      data: accommodation,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }
    return next(error);
  }
}

module.exports = {
  getAllAccommodations,
  createAccommodation,
};
