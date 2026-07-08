// backend/routes/receiptRoutes.js
// Receipts are created only as a side effect of Student Payment creation.

import { Router } from 'express';
import { listReceiptsHandler, getReceiptHandler } from '../controllers/receiptController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listReceiptsHandler);
router.get('/:id', validate(idParamValidator), getReceiptHandler);

export default router;
