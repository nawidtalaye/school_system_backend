// backend/routes/subjectRoutes.js

import { Router } from 'express';
import {
  listSubjectsHandler,
  getSubjectHandler,
  createSubjectHandler,
  updateSubjectHandler,
  deleteSubjectHandler,
} from '../controllers/subjectController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createSubjectValidator, updateSubjectValidator } from '../utils/validators/subjectValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listSubjectsHandler);
router.get('/:id', validate(idParamValidator), getSubjectHandler);
router.post('/', validate(createSubjectValidator), createSubjectHandler);
router.put('/:id', validate([...idParamValidator, ...updateSubjectValidator]), updateSubjectHandler);
router.delete('/:id', validate(idParamValidator), deleteSubjectHandler);

export default router;
