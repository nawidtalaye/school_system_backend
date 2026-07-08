// backend/middleware/validateRequest.js
// Runs after express-validator chains; converts failures into ApiError(400).
//
// Usage: router.post('/', validate([body('email').isEmail()]), controller)

import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));

    next(ApiError.badRequest('Validation failed', formattedErrors));
  };
};

export default validate;
