// backend/utils/validators/classValidators.js
import { body } from 'express-validator';

export const createClassValidator = [
  body('class_name').trim().notEmpty().withMessage('Class name is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('class_teacher_id').optional({ nullable: true }).isInt().withMessage('Invalid teacher id'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];

export const updateClassValidator = [
  body('class_name').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
  body('section').optional().trim().notEmpty().withMessage('Section cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('class_teacher_id').optional({ nullable: true }).isInt().withMessage('Invalid teacher id'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];
