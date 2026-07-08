// backend/routes/userRoutes.js

import { Router } from 'express';
import {
  createUserHandler,
  listUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import upload from '../config/multer.js';
import {
  createUserValidator,
  updateUserValidator,
} from '../utils/validators/userValidators.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

// Every route here is Admin-only, per the authorization rules.
router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listUsersHandler);
router.get('/:id', validate(idParamValidator), getUserHandler);
router.post('/', upload.single('profile_image'), validate(createUserValidator), createUserHandler);
router.put('/:id', upload.single('profile_image'), validate(updateUserValidator), updateUserHandler);
router.delete('/:id', validate(idParamValidator), deleteUserHandler);

export default router;
