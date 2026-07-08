// backend/routes/salaryRoutes.js

import { Router } from 'express';
import {
  listSalariesHandler,
  getSalaryHandler,
  createSalaryHandler,
  paySalaryHandler,
  deleteSalaryHandler,
} from '../controllers/salaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createSalaryValidator, paySalaryValidator } from '../utils/validators/salaryValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listSalariesHandler);
router.get('/:id', validate(idParamValidator), getSalaryHandler);
router.post('/', validate(createSalaryValidator), createSalaryHandler);
router.patch('/:id/pay', validate([...idParamValidator, ...paySalaryValidator]), paySalaryHandler);
router.delete('/:id', validate(idParamValidator), deleteSalaryHandler);

export default router;
