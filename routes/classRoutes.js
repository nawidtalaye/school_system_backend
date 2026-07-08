// backend/routes/classRoutes.js

import { Router } from 'express';
import {
  listClassesHandler,
  getClassHandler,
  createClassHandler,
  updateClassHandler,
  deleteClassHandler,
} from '../controllers/classController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createClassValidator, updateClassValidator } from '../utils/validators/classValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listClassesHandler);
router.get('/:id', validate(idParamValidator), getClassHandler);
router.post('/', validate(createClassValidator), createClassHandler);
router.put('/:id', validate([...idParamValidator, ...updateClassValidator]), updateClassHandler);
router.delete('/:id', validate(idParamValidator), deleteClassHandler);

export default router;
