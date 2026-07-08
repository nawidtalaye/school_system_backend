// backend/utils/validators/teacherValidators.js
import { body } from 'express-validator';

export const createTeacherValidator = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('qualification').optional().trim(),
  body('experience_years').optional().isFloat({ min: 0 }).withMessage('Experience must be a positive number'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('joining_date').isISO8601().withMessage('Joining date must be a valid date'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];

export const updateTeacherValidator = [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('gender').optional().isIn(['Male', 'Female', 'Other']),
  body('phone').optional().trim().notEmpty(),
  body('email').optional().trim().isEmail(),
  body('experience_years').optional().isFloat({ min: 0 }),
  body('salary').optional().isFloat({ min: 0 }),
  body('joining_date').optional().isISO8601(),
  body('status').optional().isIn(['Active', 'Inactive']),
];
