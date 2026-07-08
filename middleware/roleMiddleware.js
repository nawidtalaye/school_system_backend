// backend/middleware/roleMiddleware.js
// Restricts a route to a specific set of roles. Must run AFTER authMiddleware.
//
// Usage: router.get('/', authMiddleware, roleMiddleware('Admin'), controller)

import ApiError from '../utils/ApiError.js';

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required.');
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw ApiError.forbidden('You do not have permission to access this resource.');
  }

  next();
};

export default roleMiddleware;
