// backend/services/transactionService.js

import { v4 as uuidv4 } from 'uuid';
import ApiError from '../utils/ApiError.js';
import generateReferenceNumber from '../utils/generateReference.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import { createTransaction, listTransactions, findTransactionById } from '../models/transactionModel.js';

/**
 * Logs a financial event. Called internally by salaryService and
 * studentPaymentService — every Create/Update on those modules must
 * produce exactly one transaction row (per the business rules).
 */
export async function logTransaction(conn, { amount, type, salary_id, student_payment_id, created_by, notes, status }) {
  const now = new Date();
  const transaction_date = now.toISOString().slice(0, 10);
  const transaction_time = now.toTimeString().slice(0, 8);

  const id = await createTransaction(conn, {
    uuid: uuidv4(),
    reference_number: generateReferenceNumber('TRX'),
    amount,
    type,
    salary_id,
    student_payment_id,
    transaction_date,
    transaction_time,
    status,
    created_by,
    notes,
  });

  return findTransactionById(id);
}

export async function getTransactionsList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { type, status, search, sortDir } = queryParams;
  const { rows, total } = await listTransactions({ limit, offset, type, status, search, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getTransactionDetail(id) {
  const transaction = await findTransactionById(id);
  if (!transaction) throw ApiError.notFound('Transaction not found.');
  return transaction;
}
