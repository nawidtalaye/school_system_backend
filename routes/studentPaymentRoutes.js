// backend/routes/studentPaymentRoutes.js

import { Router } from 'express';
import {
  listStudentPaymentsHandler,
  getStudentPaymentHandler,
  createStudentPaymentHandler,
  updateStudentPaymentStatusHandler,
} from '../controllers/studentPaymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import {
  createStudentPaymentValidator,
  updateStudentPaymentStatusValidator,
} from '../utils/validators/studentPaymentValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listStudentPaymentsHandler);
router.get('/:id', validate(idParamValidator), getStudentPaymentHandler);
router.post('/', validate(createStudentPaymentValidator), createStudentPaymentHandler);
router.patch('/:id/status', validate([...idParamValidator, ...updateStudentPaymentStatusValidator]), updateStudentPaymentStatusHandler);

export default router;
