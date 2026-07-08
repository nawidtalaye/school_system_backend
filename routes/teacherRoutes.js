// backend/routes/teacherRoutes.js

import { Router } from 'express';
import {
  listTeachersHandler,
  getTeacherHandler,
  createTeacherHandler,
  updateTeacherHandler,
  deleteTeacherHandler,
} from '../controllers/teacherController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import upload from '../config/multer.js';
import { createTeacherValidator, updateTeacherValidator } from '../utils/validators/teacherValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listTeachersHandler);
router.get('/:id', validate(idParamValidator), getTeacherHandler);
router.post('/', upload.single('photo'), validate(createTeacherValidator), createTeacherHandler);
router.put('/:id', upload.single('photo'), validate([...idParamValidator, ...updateTeacherValidator]), updateTeacherHandler);
router.delete('/:id', validate(idParamValidator), deleteTeacherHandler);

export default router;
