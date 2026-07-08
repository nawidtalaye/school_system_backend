// backend/routes/authRoutes.js

import { Router } from 'express';
import {
  login,
  logout,
  refreshAccessToken,
  getMe,
  updatePassword,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { loginValidator, changePasswordValidator } from '../utils/validators/authValidators.js';

const router = Router();

router.post('/login', validate(loginValidator), login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', authMiddleware, getMe);
router.patch('/change-password', authMiddleware, validate(changePasswordValidator), updatePassword);

export default router;
