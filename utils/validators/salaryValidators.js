// backend/utils/validators/salaryValidators.js
import { body } from 'express-validator';

export const createSalaryValidator = [
  body('teacher_id').optional({ nullable: true }).isInt().withMessage('Invalid teacher id'),
  body('employee_id').optional({ nullable: true }).isInt().withMessage('Invalid employee id'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Invalid year'),
  body('notes').optional().trim(),
  body().custom((value) => {
    const hasTeacher = value.teacher_id !== undefined && value.teacher_id !== null;
    const hasEmployee = value.employee_id !== undefined && value.employee_id !== null;
    if (hasTeacher === hasEmployee) {
      throw new Error('Provide exactly one of teacher_id or employee_id');
    }
    return true;
  }),
];

export const paySalaryValidator = [
  body('payment_date').optional().isISO8601().withMessage('Invalid payment date'),
];
