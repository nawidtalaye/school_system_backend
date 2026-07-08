// backend/routes/employeeRoutes.js

import { Router } from 'express';
import {
  listEmployeesHandler,
  getEmployeeHandler,
  createEmployeeHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
} from '../controllers/employeeController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import upload from '../config/multer.js';
import { createEmployeeValidator, updateEmployeeValidator } from '../utils/validators/employeeValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listEmployeesHandler);
router.get('/:id', validate(idParamValidator), getEmployeeHandler);
router.post('/', upload.single('photo'), validate(createEmployeeValidator), createEmployeeHandler);
router.put('/:id', upload.single('photo'), validate([...idParamValidator, ...updateEmployeeValidator]), updateEmployeeHandler);
router.delete('/:id', validate(idParamValidator), deleteEmployeeHandler);

export default router;
