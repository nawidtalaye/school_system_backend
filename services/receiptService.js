// backend/services/receiptService.js

import ApiError from '../utils/ApiError.js';
import generateReferenceNumber from '../utils/generateReference.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import { createReceipt, findReceiptById, listReceipts } from '../models/receiptModel.js';

/**
 * Issues a receipt for a student payment. Called internally by
 * studentPaymentService within the same DB transaction as the payment.
 */
export async function issueReceipt(conn, { student_payment_id, issued_by, notes }) {
  const receipt_number = generateReferenceNumber('RCT');
  const issued_date = new Date().toISOString().slice(0, 10);

  const id = await createReceipt(conn, {
    student_payment_id,
    receipt_number,
    issued_date,
    issued_by,
    notes,
  });

  return findReceiptById(id);
}

export async function getReceiptsList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, sortDir } = queryParams;
  const { rows, total } = await listReceipts({ limit, offset, search, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getReceiptDetail(id) {
  const receipt = await findReceiptById(id);
  if (!receipt) throw ApiError.notFound('Receipt not found.');
  return receipt;
}
