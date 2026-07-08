// backend/middleware/errorHandler.js
// Centralized error handler. Must be registered LAST in index.js.

import ApiError from '../utils/ApiError.js';

export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let error = err;

  // Normalize known error types into ApiError
  if (!(error instanceof ApiError)) {
    if (error.name === 'JsonWebTokenError') {
      error = ApiError.unauthorized('Invalid token.');
    } else if (error.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Token has expired.');
    } else if (error.code === 'ER_DUP_ENTRY') {
      error = ApiError.conflict('A record with this value already exists.');
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2') {
      error = ApiError.badRequest('This operation violates a database relationship constraint.');
    } else if (error.name === 'MulterError') {
      error = ApiError.badRequest(error.message);
    } else {
      const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
      error = new ApiError(statusCode, error.message || 'Internal Server Error');
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}
