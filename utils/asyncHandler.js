// backend/utils/asyncHandler.js
// Wraps async route handlers so rejected promises reach the error middleware.

const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export default asyncHandler;
