const express = require("express");
const {
  createReservation,
  getReservationsByUser,
  getReservationsByHost,
  deleteReservation,
} = require("../controllers/reservationController");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// All reservation routes require login
router.use(auth);

router.post("/", asyncHandler(createReservation));
router.get("/user", asyncHandler(getReservationsByUser));
router.get("/host", asyncHandler(getReservationsByHost));
router.delete("/:id", asyncHandler(deleteReservation));

module.exports = router;
