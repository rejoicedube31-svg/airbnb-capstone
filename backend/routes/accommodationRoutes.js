const express = require("express");
const {
  getAllAccommodations,
  getAccommodationById,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  uploadListingImage,
} = require("../controllers/accommodationController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Public — guests browse listings without logging in
router.get("/", asyncHandler(getAllAccommodations));

// Protected — upload before /:id so "upload" is not treated as an id
router.post(
  "/upload",
  auth,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  asyncHandler(uploadListingImage)
);

router.get("/:id", asyncHandler(getAccommodationById));

// Protected — only logged-in hosts can create / update / delete
router.post("/", auth, asyncHandler(createAccommodation));
router.put("/:id", auth, asyncHandler(updateAccommodation));
router.delete("/:id", auth, asyncHandler(deleteAccommodation));

module.exports = router;
