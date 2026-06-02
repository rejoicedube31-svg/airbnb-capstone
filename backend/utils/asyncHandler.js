/**
 * Wraps async route handlers so errors go to errorHandler via next(err).
 * Why: Express does not catch errors inside async functions by default.
 */
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
