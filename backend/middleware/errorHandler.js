/**
 * Global error handler (must have 4 parameters so Express treats it as error middleware).
 * Why: One place to send consistent JSON errors instead of crashing the server.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid id in request",
    });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(", "),
    });
  }

  // Duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value — that record already exists",
    });
  }

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Internal server error" : err.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
