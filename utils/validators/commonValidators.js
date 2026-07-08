// backend/utils/validators/commonValidators.js
// Shared across every CRUD module — id params, list/pagination query params.

import { param, query } from 'express-validator';

export const idParamValidator = [
  param('id').isInt().withMessage('Invalid id'),
];

export const listQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sortDir').optional().isIn(['asc', 'desc', 'ASC', 'DESC']).withMessage('sortDir must be asc or desc'),
];
