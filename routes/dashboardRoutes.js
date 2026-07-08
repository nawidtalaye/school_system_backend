// backend/routes/dashboardRoutes.js

import { Router } from 'express';
import { getDashboardHandler } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('Admin'), getDashboardHandler);

export default router;
