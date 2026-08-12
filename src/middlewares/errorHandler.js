/**
 * ============================================================
 *  errorHandler.js
 * ------------------------------------------------------------
 *  Last middleware in the chain. Catches anything passed to
 *  next(err) - ApiError (known, has statusCode) or unexpected
 *  errors (default to 500) - and returns one consistent shape.
 * ============================================================
 */

// 404 handler for routes that don't exist at all
const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.isApiError ? err.statusCode : 500;
  const message = err.isApiError ? err.message : 'Internal server error';

  if (!err.isApiError) {
    // Log unexpected errors for debugging; don't leak details to the client.
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { errorHandler, notFoundHandler };
