// backend/models/studentPaymentModel.js

import pool from '../config/database.js';

export async function listStudentPayments({ limit, offset, status, studentId, sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (status) {
    whereClauses.push('sp.status = ?');
    params.push(status);
  }
  if (studentId) {
    whereClauses.push('sp.student_id = ?');
    params.push(studentId);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT sp.*, CONCAT(s.first_name, ' ', s.last_name) AS student_name
     FROM student_payments sp
     JOIN students s ON s.id = sp.student_id
     ${whereSql}
     ORDER BY sp.payment_date ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM student_payments sp JOIN students s ON s.id = sp.student_id ${whereSql}`,
    params
  );

  return { rows, total: countRows[0].total };
}

export async function findStudentPaymentById(id, conn) {
  const executor = conn || pool;
  const [rows] = await executor.query(
    `SELECT sp.*, CONCAT(s.first_name, ' ', s.last_name) AS student_name
     FROM student_payments sp
     JOIN students s ON s.id = sp.student_id
     WHERE sp.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function createStudentPayment(conn, data) {
  const executor = conn || pool;
  const [result] = await executor.query(
    `INSERT INTO student_payments (student_id, amount, payment_date, receipt_number, payment_method, description, status)
     VALUES (?, ?, ?, ?, ?, ?, 'Completed')`,
    [data.student_id, data.amount, data.payment_date, data.receipt_number, data.payment_method, data.description || null]
  );
  return findStudentPaymentById(result.insertId, executor);
}

export async function updateStudentPaymentStatus(id, status) {
  await pool.query('UPDATE student_payments SET status = ? WHERE id = ?', [status, id]);
  return findStudentPaymentById(id);
}

export async function sumPaymentsToday() {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM student_payments
     WHERE status = 'Completed' AND payment_date = CURDATE()`
  );
  return Number(rows[0].total);
}

export async function sumPaymentsThisMonth() {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM student_payments
     WHERE status = 'Completed' AND MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())`
  );
  return Number(rows[0].total);
}

export async function sumAllPayments() {
  const [rows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM student_payments WHERE status = 'Completed'`
  );
  return Number(rows[0].total);
}
