// backend/utils/validators/userValidators.js
import { body, param } from 'express-validator';

export const createUserValidator = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Admin', 'Staff', 'Accountant', 'Teacher']).withMessage('Invalid role'),
];

export const updateUserValidator = [
  param('id').isInt().withMessage('Invalid user id'),
  body('full_name').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').optional().trim().isEmail().withMessage('A valid email is required'),
  body('role').optional().isIn(['Admin', 'Staff', 'Accountant', 'Teacher']).withMessage('Invalid role'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];

export { idParamValidator, listQueryValidator } from './commonValidators.js';
