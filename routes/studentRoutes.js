// backend/routes/studentRoutes.js

import { Router } from 'express';
import {
  listStudentsHandler,
  getStudentHandler,
  createStudentHandler,
  updateStudentHandler,
  deleteStudentHandler,
} from '../controllers/studentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import upload from '../config/multer.js';
import { createStudentValidator, updateStudentValidator } from '../utils/validators/studentValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listStudentsHandler);
router.get('/:id', validate(idParamValidator), getStudentHandler);
router.post('/', upload.single('photo'), validate(createStudentValidator), createStudentHandler);
router.put('/:id', upload.single('photo'), validate([...idParamValidator, ...updateStudentValidator]), updateStudentHandler);
router.delete('/:id', validate(idParamValidator), deleteStudentHandler);

export default router;
