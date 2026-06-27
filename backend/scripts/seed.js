require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const User = require("../models/User");
const Accommodation = require("../models/Accommodation");
const Reservation = require("../models/Reservation");

function gallery(primary, fallback = "/images/listings/apartment-2.jpg") {
  return [
    primary,
    fallback,
    "/images/listings/apartment-3.jpg",
    "/images/listings/apartment-4.jpg",
    "/images/listings/apartment-5.jpg",
  ];
}

/**
 * Seed script — sample users, six listings, one reservation.
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

  await Promise.all([
    Reservation.deleteMany({}),
    Accommodation.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log("Cleared users, accommodations, reservations");

  const john = await User.create({
    username: "Jannie",
    email: "jannie@example.com",
    password: "password123",
    role: "user",
  });

  const jane = await User.create({
    username: "Lerato",
    email: "lerato@example.com",
    password: "password321",
    role: "host",
  });

  const listings = await Accommodation.insertMany([
    {
      title: "Modern Apartment in Cape Town",
      description:
        "Stay in the heart of Cape Town in this modern apartment, close to the V&A Waterfront and Table Mountain. Equipped with everything you need for a comfortable stay.",
      type: "Entire apartment",
      location: "Cape Town",
      guests: 4,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["wifi", "kitchen", "free parking", "pool"],
      images: gallery("/images/listings/apartment-1.jpg"),
      price: 850,
      weeklyDiscount: 0,
      cleaningFee: 50,
      serviceFee: 50,
      occupancyTaxes: 30,
      rating: 4.5,
      reviews: 320,
      host: "Lerato",
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
    },
    {
      title: "Family Home in Cape Town",
      description:
        "Quiet Cape Town neighbourhood with a garden, fast Wi-Fi, and room for the whole family. Ideal for longer stays near beaches, schools, and the city centre.",
      type: "Entire house",
      location: "Cape Town",
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["wifi", "kitchen", "free parking", "garden", "braai area"],
      images: gallery("/images/listings/house-1.jpg", "/images/listings/house-2.jpg"),
      price: 1200,
      weeklyDiscount: 100,
      cleaningFee: 75,
      serviceFee: 60,
      occupancyTaxes: 35,
      rating: 4.7,
      reviews: 84,
      host: "Lerato",
      hostId: jane._id,
      enhancedCleaning: true,
      selfCheckIn: false,
      specificRatings: {
        cleanliness: 4.9,
        communication: 4.8,
        checkIn: 4.6,
        accuracy: 4.7,
        location: 4.8,
        value: 4.6,
      },
    },
    {
      title: "Loft in New York",
      description:
        "Bright loft steps from Manhattan attractions. Skyline views, fast Wi-Fi, and easy subway access for exploring New York City.",
      type: "Entire apartment",
      location: "New York",
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "kitchen", "elevator", "workspace"],
      images: gallery("/images/listings/new-york.jpg"),
      price: 320,
      weeklyDiscount: 0,
      cleaningFee: 50,
      serviceFee: 45,
      occupancyTaxes: 30,
      rating: 4.6,
      reviews: 156,
      host: "Lerato",
      hostId: jane._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 4.7,
        communication: 4.8,
        checkIn: 4.5,
        accuracy: 4.6,
        location: 4.9,
        value: 4.4,
      },
    },
    {
      title: "Charming Flat in Paris",
      description:
        "Classic Parisian flat near cafés and museums. Perfect for a romantic getaway or culture-filled city break.",
      type: "Entire apartment",
      location: "Paris",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "kitchen", "heating", "washer"],
      images: gallery("/images/listings/paris.jpg"),
      price: 280,
      weeklyDiscount: 0,
      cleaningFee: 40,
      serviceFee: 40,
      occupancyTaxes: 25,
      rating: 4.8,
      reviews: 203,
      host: "Lerato",
      hostId: jane._id,
      enhancedCleaning: true,
      selfCheckIn: false,
      specificRatings: {
        cleanliness: 4.9,
        communication: 4.7,
        checkIn: 4.8,
        accuracy: 4.7,
        location: 4.9,
        value: 4.5,
      },
    },
    {
      title: "Studio in Tokyo",
      description:
        "Compact studio in a lively Tokyo district. Walk to transit, ramen spots, and neon-lit streets.",
      type: "Entire apartment",
      location: "Tokyo",
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["wifi", "kitchen", "air conditioning", "pocket wifi"],
      images: gallery("/images/listings/tokyo.jpg"),
      price: 250,
      weeklyDiscount: 0,
      cleaningFee: 35,
      serviceFee: 35,
      occupancyTaxes: 20,
      rating: 4.7,
      reviews: 98,
      host: "Lerato",
      hostId: jane._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 4.8,
        communication: 4.9,
        checkIn: 4.7,
        accuracy: 4.6,
        location: 4.8,
        value: 4.6,
      },
    },
    {
      title: "Villa in Phuket",
      description:
        "Relaxing villa near Phuket beaches with pool access and tropical views. Ideal for sun, sea, and island adventures.",
      type: "Entire villa",
      location: "Phuket",
      guests: 5,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["wifi", "kitchen", "pool", "free parking", "beach access"],
      images: gallery("/images/listings/phuket.jpg"),
      price: 180,
      weeklyDiscount: 50,
      cleaningFee: 45,
      serviceFee: 35,
      occupancyTaxes: 20,
      rating: 4.9,
      reviews: 67,
      host: "Lerato",
      hostId: jane._id,
      enhancedCleaning: true,
      selfCheckIn: true,
      specificRatings: {
        cleanliness: 4.9,
        communication: 4.8,
        checkIn: 4.9,
        accuracy: 4.8,
        location: 4.9,
        value: 4.7,
      },
    },
  ]);

  const capeTownApartment = listings[0];
  const checkIn = new Date("2026-07-01");
  const checkOut = new Date("2026-07-08");
  const nights = 7;
  const pricePerNight = capeTownApartment.price;
  const subtotal = pricePerNight * nights;
  const totalPrice =
    subtotal -
    capeTownApartment.weeklyDiscount +
    capeTownApartment.cleaningFee +
    capeTownApartment.serviceFee +
    capeTownApartment.occupancyTaxes;

  await Reservation.create({
    accommodation: capeTownApartment._id,
    user: john._id,
    host: jane._id,
    checkIn,
    checkOut,
    guests: 2,
    nights,
    pricePerNight,
    weeklyDiscount: capeTownApartment.weeklyDiscount,
    cleaningFee: capeTownApartment.cleaningFee,
    serviceFee: capeTownApartment.serviceFee,
    occupancyTaxes: capeTownApartment.occupancyTaxes,
    totalPrice,
  });

  console.log("Seed complete:");
  console.log("  Users: jannie@example.com / password123 (Jannie, guest)");
  console.log("         lerato@example.com / password321 (Lerato, host)");
  listings.forEach((item) => {
    console.log("  Listing:", item.title, "—", item.location);
  });

  await require("mongoose").disconnect();
  console.log("Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
