const mongoose = require("mongoose");
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
 * Optional query: ?location=Cape Town
 * Why: Public site lists properties; location filter matches the Location Page brief.
 */
async function getAllAccommodations(req, res) {
  const filter = {};

  const locationQuery = req.query.location?.trim();
  if (locationQuery && locationQuery.toLowerCase() !== "all") {
    filter.location = { $regex: locationQuery, $options: "i" };
  }

  const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: accommodations.length,
    data: accommodations,
  });
}

/**
 * GET /api/accommodations/:id
 * Why: Location Details page and admin “edit listing” need one listing by id.
 */
async function getAccommodationById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid listing id",
    });
  }

  const accommodation = await Accommodation.findById(id);

  if (!accommodation) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  res.status(200).json({
    success: true,
    data: accommodation,
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

function hostOnly(req, res) {
  if (req.user.role !== "host") {
    res.status(403).json({
      success: false,
      message: "Only hosts can manage listings",
    });
    return false;
  }
  return true;
}

async function findOwnedListing(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: { status: 400, message: "Invalid listing id" } };
  }

  const accommodation = await Accommodation.findById(id);

  if (!accommodation) {
    return { error: { status: 404, message: "Listing not found" } };
  }

  if (accommodation.hostId.toString() !== userId) {
    return { error: { status: 403, message: "You can only change your own listings" } };
  }

  return { accommodation };
}

/**
 * PUT /api/accommodations/:id
 * Why: Admin “update listing” form saves changes to an existing document.
 */
async function updateAccommodation(req, res, next) {
  if (!hostOnly(req, res)) return;

  const { accommodation, error } = await findOwnedListing(
    req.params.id,
    req.user.userId
  );

  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  const updates = { ...req.body };
  delete updates.host;
  delete updates.hostId;
  delete updates._id;

  try {
    const updated = await Accommodation.findByIdAndUpdate(
      accommodation._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }
    return next(err);
  }
}

/**
 * DELETE /api/accommodations/:id
 * Why: Admin “view listings” page needs delete per row.
 */
async function deleteAccommodation(req, res) {
  if (!hostOnly(req, res)) return;

  const { accommodation, error } = await findOwnedListing(
    req.params.id,
    req.user.userId
  );

  if (error) {
    return res.status(error.status).json({ success: false, message: error.message });
  }

  await accommodation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Listing deleted",
  });
}

/**
 * POST /api/accommodations/upload
 * Form field name: image
 * Why: Optional brief feature — host uploads a photo, gets a URL for the listing images array.
 */
function uploadListingImage(req, res) {
  if (req.user.role !== "host") {
    return res.status(403).json({
      success: false,
      message: "Only hosts can upload listing images",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file — use form field name 'image'",
    });
  }

  const url = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    url,
    message: "Image uploaded — add this url to the listing images array",
  });
}

module.exports = {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  uploadListingImage,
};
