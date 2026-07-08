// backend/models/transactionModel.js

import pool from '../config/database.js';

export async function createTransaction(conn, data) {
  const executor = conn || pool;
  const [result] = await executor.query(
    `INSERT INTO transactions
      (uuid, reference_number, amount, type, salary_id, student_payment_id, transaction_date, transaction_time, status, created_by, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.uuid,
      data.reference_number,
      data.amount,
      data.type,
      data.salary_id || null,
      data.student_payment_id || null,
      data.transaction_date,
      data.transaction_time,
      data.status || 'Completed',
      data.created_by || null,
      data.notes || null,
    ]
  );
  return result.insertId;
}

export async function listTransactions({ limit, offset, type, status, search, sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (type) {
    whereClauses.push('t.type = ?');
    params.push(type);
  }
  if (status) {
    whereClauses.push('t.status = ?');
    params.push(status);
  }
  if (search) {
    whereClauses.push('(t.reference_number LIKE ? OR t.uuid LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT t.*, u.full_name AS created_by_name
     FROM transactions t
     LEFT JOIN users u ON u.id = t.created_by
     ${whereSql}
     ORDER BY t.transaction_date ${safeSortDir}, t.transaction_time ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM transactions t ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findTransactionById(id) {
  const [rows] = await pool.query(
    `SELECT t.*, u.full_name AS created_by_name
     FROM transactions t
     LEFT JOIN users u ON u.id = t.created_by
     WHERE t.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function listRecentTransactions(limit = 5) {
  const [rows] = await pool.query(
    `SELECT t.*, u.full_name AS created_by_name
     FROM transactions t
     LEFT JOIN users u ON u.id = t.created_by
     ORDER BY t.transaction_date DESC, t.transaction_time DESC
     LIMIT ?`,
    [Number(limit)]
  );
  return rows;
}
