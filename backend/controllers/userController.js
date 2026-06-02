const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * POST /api/users/login
 * Body: { email, password }
 * Why: Brief requires JWT login; frontends store token and send it on protected calls.
 */
async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  if (!process.env.JWT_SECRET) {
    const err = new Error("JWT_SECRET is missing in .env");
    err.statusCode = 500;
    return next(err);
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

/**
 * GET /api/users/me — example protected route (for testing auth middleware).
 */
function getMe(req, res) {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}

module.exports = { login, getMe };
