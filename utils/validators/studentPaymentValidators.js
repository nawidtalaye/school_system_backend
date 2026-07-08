// backend/utils/validators/studentPaymentValidators.js
import { body } from 'express-validator';

export const createStudentPaymentValidator = [
  body('student_id').isInt().withMessage('Invalid student id'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('payment_date').isISO8601().withMessage('Payment date must be a valid date'),
  body('payment_method').isIn(['Cash', 'Card', 'Bank Transfer', 'Online']).withMessage('Invalid payment method'),
  body('description').optional().trim(),
];

export const updateStudentPaymentStatusValidator = [
  body('status').isIn(['Pending', 'Completed', 'Refunded', 'Cancelled']).withMessage('Invalid status'),
];
