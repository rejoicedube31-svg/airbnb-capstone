/**
 * Global error handler (must have 4 parameters so Express treats it as error middleware).
 * Why: One place to send consistent JSON errors instead of crashing the server.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Internal server error" : err.message || "Request failed";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
