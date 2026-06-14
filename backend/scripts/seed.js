require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");
const Reservation = require("../models/Reservation");

/**
 * Seed script — inserts sample users, one listing, and one reservation.
 * Why: Lets you test the API and UI without typing data by hand every time.
 *
 * Run from backend folder: npm run seed
 */
async function seed() {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.startsWith("mongodb+srv://")) {
    console.error("\nYour MONGODB_URI still uses mongodb+srv://");
    console.error("That causes: querySrv ECONNREFUSED on many Windows PCs.");
    console.error("\nFix:");
    console.error("  1. Atlas → Database → Connect → Compass (or Drivers)");
    console.error("  2. Copy the string that starts with mongodb:// (NOT mongodb+srv)");
    console.error("  3. Put it in backend/.env and include /airbnb-capstone before the ?");
    console.error("\nSee backend/.env.atlas-example for the shape of the URI.\n");
    process.exit(1);
  }

  await connectDB(uri);

  // Clear old sample data so re-running seed does not duplicate records.
  await Promise.all([
    Reservation.deleteMany({}),
    Accommodation.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log("Cleared users, accommodations, reservations");

  const john = await User.create({
    username: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  });

  const jane = await User.create({
    username: "Jane Doe",
    email: "jane@example.com",
    password: "password321",
    role: "host",
  });

  const listing = await Accommodation.create({
    title: "Modern Apartment in Centurion",
    description:
      "Stay in Centurion, Gauteng — close to malls, highways, and Pretoria/Johannesburg.",
    type: "Entire apartment",
    location: "Centurion",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["wifi", "kitchen", "free parking", "pool"],
    images: [
      "https://images.unsplash.com/photo-1580060839134-75a3eade3bf6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472553-efd46b0c38d8?auto=format&fit=crop&w=800&q=80",
    ],
    price: 850,
    weeklyDiscount: 0,
    cleaningFee: 50,
    serviceFee: 50,
    occupancyTaxes: 30,
    rating: 4.5,
    reviews: 320,
    host: "Jane Doe",
    hostId: jane._id,
    enhancedCleaning: true,
    selfCheckIn: true,
    specificRatings: {
      cleanliness: 4.8,
      communication: 4.7,
      checkIn: 4.9,
      accuracy: 4.6,
      location: 4.9,
      value: 4.5,
    },
  });

  const checkIn = new Date("2026-07-01");
  const checkOut = new Date("2026-07-08");
  const nights = 7;
  const pricePerNight = listing.price;
  const subtotal = pricePerNight * nights;
  const totalPrice =
    subtotal -
    listing.weeklyDiscount +
    listing.cleaningFee +
    listing.serviceFee +
    listing.occupancyTaxes;

  await Reservation.create({
    accommodation: listing._id,
    user: john._id,
    host: jane._id,
    checkIn,
    checkOut,
    guests: 2,
    nights,
    pricePerNight,
    weeklyDiscount: listing.weeklyDiscount,
    cleaningFee: listing.cleaningFee,
    serviceFee: listing.serviceFee,
    occupancyTaxes: listing.occupancyTaxes,
    totalPrice,
  });

  console.log("Seed complete:");
  console.log("  Users: john@example.com / password123 (user)");
  console.log("         jane@example.com / password321 (host)");
  console.log("  Listing:", listing.title, "—", listing.location);

  await require("mongoose").disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
