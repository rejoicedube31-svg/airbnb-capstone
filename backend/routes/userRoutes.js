const express = require("express");
const { login, getMe } = require("../controllers/userController");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/login", asyncHandler(login));
router.get("/me", auth, getMe);

module.exports = router;
