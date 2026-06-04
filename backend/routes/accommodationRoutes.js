const express = require("express");
const {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} = require("../controllers/accommodationController");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Public — guests browse listings without logging in
router.get("/", asyncHandler(getAllAccommodations));
router.get("/:id", asyncHandler(getAccommodationById));

// Protected — only logged-in hosts can create / update / delete
router.post("/", auth, asyncHandler(createAccommodation));
router.put("/:id", auth, asyncHandler(updateAccommodation));
router.delete("/:id", auth, asyncHandler(deleteAccommodation));

module.exports = router;
