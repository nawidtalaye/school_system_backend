// backend/services/studentPaymentService.js

import pool from '../config/database.js';
import ApiError from '../utils/ApiError.js';
import generateReferenceNumber from '../utils/generateReference.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listStudentPayments,
  findStudentPaymentById,
  createStudentPayment,
  updateStudentPaymentStatus,
} from '../models/studentPaymentModel.js';
import { createReceipt } from '../models/receiptModel.js';
import { logTransaction } from './transactionService.js';

export async function getStudentPaymentsList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { status, studentId, sortDir } = queryParams;
  const { rows, total } = await listStudentPayments({ limit, offset, status, studentId, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getStudentPaymentDetail(id) {
  const payment = await findStudentPaymentById(id);
  if (!payment) throw ApiError.notFound('Student payment not found.');
  return payment;
}

/**
 * Records a student payment. Per the business rules, every financial
 * operation must produce a transaction, and every student payment must
 * produce a receipt — both happen atomically with the payment itself.
 */
export async function addStudentPayment(data, requesterId) {
  const receiptNumber = generateReferenceNumber('RCT');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const payment = await createStudentPayment(connection, {
      ...data,
      receipt_number: receiptNumber,
    });

    await createReceipt(connection, {
      student_payment_id: payment.id,
      receipt_number: receiptNumber,
      issued_date: data.payment_date,
      issued_by: requesterId,
      notes: `Receipt for payment #${payment.id}`,
    });

    await logTransaction(connection, {
      amount: data.amount,
      type: 'Student Payment',
      student_payment_id: payment.id,
      created_by: requesterId,
      status: 'Completed',
      notes: `Payment from student #${data.student_id}`,
    });

    await connection.commit();
    return payment;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function changeStudentPaymentStatus(id, status) {
  const existing = await findStudentPaymentById(id);
  if (!existing) throw ApiError.notFound('Student payment not found.');
  return updateStudentPaymentStatus(id, status);
}
