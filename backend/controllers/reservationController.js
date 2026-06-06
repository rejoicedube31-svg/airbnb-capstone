const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Accommodation = require("../models/Accommodation");

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.ceil((end - start) / msPerDay);
  return nights;
}

function calculateTotalPrice(listing, nights) {
  const subtotal = listing.price * nights;
  return (
    subtotal -
    (listing.weeklyDiscount || 0) +
    (listing.cleaningFee || 0) +
    (listing.serviceFee || 0) +
    (listing.occupancyTaxes || 0)
  );
}

/**
 * POST /api/reservations
 * Body: { accommodation, checkIn, checkOut, guests }
 * Why: Location Details “Reserve” button saves a booking to MongoDB.
 */
async function createReservation(req, res, next) {
  const { accommodation: accommodationId, checkIn, checkOut, guests } = req.body;

  if (!accommodationId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({
      success: false,
      message: "accommodation, checkIn, checkOut, and guests are required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(accommodationId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid accommodation id",
    });
  }

  const listing = await Accommodation.findById(accommodationId);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found",
    });
  }

  const nights = calculateNights(checkIn, checkOut);

  if (nights < 1) {
    return res.status(400).json({
      success: false,
      message: "checkOut must be after checkIn",
    });
  }

  if (Number(guests) < 1) {
    return res.status(400).json({
      success: false,
      message: "At least 1 guest is required",
    });
  }

  if (Number(guests) > listing.guests) {
    return res.status(400).json({
      success: false,
      message: `This listing allows a maximum of ${listing.guests} guests`,
    });
  }

  try {
    const reservation = await Reservation.create({
      accommodation: listing._id,
      user: req.user.userId,
      host: listing.hostId,
      checkIn,
      checkOut,
      guests,
      nights,
      pricePerNight: listing.price,
      weeklyDiscount: listing.weeklyDiscount || 0,
      cleaningFee: listing.cleaningFee || 0,
      serviceFee: listing.serviceFee || 0,
      occupancyTaxes: listing.occupancyTaxes || 0,
      totalPrice: calculateTotalPrice(listing, nights),
    });

    res.status(201).json({
      success: true,
      data: reservation,
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

/**
 * GET /api/reservations/user
 * Why: Guest profile / header “view my reservations”.
 */
async function getReservationsByUser(req, res) {
  const reservations = await Reservation.find({ user: req.user.userId })
    .populate("accommodation", "title location price images type")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
}

/**
 * GET /api/reservations/host
 * Why: Host/admin dropdown “view reservations” for their listings.
 */
async function getReservationsByHost(req, res) {
  if (req.user.role !== "host") {
    return res.status(403).json({
      success: false,
      message: "Only hosts can view host reservations",
    });
  }

  const reservations = await Reservation.find({ host: req.user.userId })
    .populate("accommodation", "title location price")
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
}

/**
 * DELETE /api/reservations/:id
 * Why: Cancel a booking — guest who booked or host who owns the listing.
 */
async function deleteReservation(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid reservation id",
    });
  }

  const reservation = await Reservation.findById(id);

  if (!reservation) {
    return res.status(404).json({
      success: false,
      message: "Reservation not found",
    });
  }

  const isGuest = reservation.user.toString() === req.user.userId;
  const isHost = reservation.host.toString() === req.user.userId;

  if (!isGuest && !isHost) {
    return res.status(403).json({
      success: false,
      message: "You can only cancel your own reservations",
    });
  }

  await reservation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Reservation cancelled",
  });
}

module.exports = {
  createReservation,
  getReservationsByUser,
  getReservationsByHost,
  deleteReservation,
};
