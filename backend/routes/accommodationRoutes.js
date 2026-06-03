const express = require("express");
const {
  getAllAccommodations,
  createAccommodation,
} = require("../controllers/accommodationController");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Public — guests browse listings without logging in
router.get("/", asyncHandler(getAllAccommodations));

// Protected — only logged-in hosts can create
router.post("/", auth, asyncHandler(createAccommodation));

module.exports = router;
