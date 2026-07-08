// backend/routes/transactionRoutes.js
// Transactions are created only as a side effect of Salary/Payment
// operations, so this router exposes read-only history endpoints.

import { Router } from 'express';
import { listTransactionsHandler, getTransactionHandler } from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { idParamValidator, listQueryValidator } from '../utils/validators/commonValidators.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('Admin'));

router.get('/', validate(listQueryValidator), listTransactionsHandler);
router.get('/:id', validate(idParamValidator), getTransactionHandler);

export default router;
