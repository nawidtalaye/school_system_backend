// backend/routes/index.js
// Mounts every feature router under /api/v1/*

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import classRoutes from './classRoutes.js';
import teacherRoutes from './teacherRoutes.js';
import studentRoutes from './studentRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import salaryRoutes from './salaryRoutes.js';
import studentPaymentRoutes from './studentPaymentRoutes.js';
import receiptRoutes from './receiptRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/teachers', teacherRoutes);
router.use('/students', studentRoutes);
router.use('/subjects', subjectRoutes);
router.use('/employees', employeeRoutes);
router.use('/salaries', salaryRoutes);
router.use('/student-payments', studentPaymentRoutes);
router.use('/receipts', receiptRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
