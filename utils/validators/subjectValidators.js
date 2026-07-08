// backend/utils/validators/subjectValidators.js
import { body } from 'express-validator';

export const createSubjectValidator = [
  body('subject_name').trim().notEmpty().withMessage('Subject name is required'),
  body('code').trim().notEmpty().withMessage('Subject code is required'),
  body('teacher_id').optional({ nullable: true }).isInt().withMessage('Invalid teacher id'),
  body('class_id').optional({ nullable: true }).isInt().withMessage('Invalid class id'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
];

export const updateSubjectValidator = [
  body('subject_name').optional().trim().notEmpty(),
  body('code').optional().trim().notEmpty(),
  body('teacher_id').optional({ nullable: true }).isInt(),
  body('class_id').optional({ nullable: true }).isInt(),
  body('status').optional().isIn(['Active', 'Inactive']),
];
