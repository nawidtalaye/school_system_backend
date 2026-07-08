// backend/models/receiptModel.js

import pool from '../config/database.js';

export async function createReceipt(conn, data) {
  const executor = conn || pool;
  const [result] = await executor.query(
    `INSERT INTO receipts (student_payment_id, receipt_number, issued_date, issued_by, notes)
     VALUES (?, ?, ?, ?, ?)`,
    [data.student_payment_id, data.receipt_number, data.issued_date, data.issued_by || null, data.notes || null]
  );
  return result.insertId;
}

export async function findReceiptById(id) {
  const [rows] = await pool.query(
    `SELECT r.*, sp.amount, sp.student_id, CONCAT(s.first_name, ' ', s.last_name) AS student_name
     FROM receipts r
     JOIN student_payments sp ON sp.id = r.student_payment_id
     JOIN students s ON s.id = sp.student_id
     WHERE r.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function listReceipts({ limit, offset, search, sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(r.receipt_number LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT r.*, sp.amount, sp.student_id, CONCAT(s.first_name, ' ', s.last_name) AS student_name
     FROM receipts r
     JOIN student_payments sp ON sp.id = r.student_payment_id
     JOIN students s ON s.id = sp.student_id
     ${whereSql}
     ORDER BY r.issued_date ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM receipts r
     JOIN student_payments sp ON sp.id = r.student_payment_id
     JOIN students s ON s.id = sp.student_id
     ${whereSql}`,
    params
  );

  return { rows, total: countRows[0].total };
}
