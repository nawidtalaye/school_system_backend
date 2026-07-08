// backend/utils/validators/studentValidators.js
import { body } from 'express-validator';

export const createStudentValidator = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('date_of_birth').isISO8601().withMessage('Date of birth must be a valid date'),
  body('guardian_name').trim().notEmpty().withMessage('Guardian name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').optional({ nullable: true }).trim().isEmail().withMessage('Invalid email'),
  body('class_id').optional({ nullable: true }).isInt().withMessage('Invalid class id'),
  body('admission_date').isISO8601().withMessage('Admission date must be a valid date'),
  body('status').optional().isIn(['Active', 'Inactive', 'Graduated', 'Suspended']).withMessage('Invalid status'),
];

export const updateStudentValidator = [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('gender').optional().isIn(['Male', 'Female', 'Other']),
  body('date_of_birth').optional().isISO8601(),
  body('guardian_name').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
  body('email').optional({ nullable: true }).trim().isEmail(),
  body('class_id').optional({ nullable: true }).isInt(),
  body('admission_date').optional().isISO8601(),
  body('status').optional().isIn(['Active', 'Inactive', 'Graduated', 'Suspended']),
];
