// backend/utils/validators/employeeValidators.js
import { body } from 'express-validator';

export const createEmployeeValidator = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional({ nullable: true }).trim().isEmail().withMessage('Invalid email'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('joining_date').isISO8601().withMessage('Joining date must be a valid date'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];

export const updateEmployeeValidator = [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('designation').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
  body('email').optional({ nullable: true }).trim().isEmail(),
  body('salary').optional().isFloat({ min: 0 }),
  body('joining_date').optional().isISO8601(),
  body('status').optional().isIn(['Active', 'Inactive']),
];
