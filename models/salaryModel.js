// backend/models/salaryModel.js

import pool from '../config/database.js';

export async function listSalaries({ limit, offset, status, month, year, sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (status) {
    whereClauses.push('sl.status = ?');
    params.push(status);
  }
  if (month) {
    whereClauses.push('sl.month = ?');
    params.push(month);
  }
  if (year) {
    whereClauses.push('sl.year = ?');
    params.push(year);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT sl.*,
            CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
            CONCAT(e.first_name, ' ', e.last_name) AS employee_name
     FROM salaries sl
     LEFT JOIN teachers t ON t.id = sl.teacher_id
     LEFT JOIN employees e ON e.id = sl.employee_id
     ${whereSql}
     ORDER BY sl.year ${safeSortDir}, sl.month ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM salaries sl ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findSalaryById(id, conn) {
  const executor = conn || pool;
  const [rows] = await executor.query(
    `SELECT sl.*,
            CONCAT(t.first_name, ' ', t.last_name) AS teacher_name,
            CONCAT(e.first_name, ' ', e.last_name) AS employee_name
     FROM salaries sl
     LEFT JOIN teachers t ON t.id = sl.teacher_id
     LEFT JOIN employees e ON e.id = sl.employee_id
     WHERE sl.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function createSalary(data) {
  const [result] = await pool.query(
    `INSERT INTO salaries (teacher_id, employee_id, amount, month, year, status, notes)
     VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
    [data.teacher_id || null, data.employee_id || null, data.amount, data.month, data.year, data.notes || null]
  );
  return findSalaryById(result.insertId);
}

export async function markSalaryPaid(conn, id, paymentDate) {
  await conn.query(
    `UPDATE salaries SET status = 'Paid', payment_date = ? WHERE id = ?`,
    [paymentDate, id]
  );
  return findSalaryById(id, conn);
}

export async function deleteSalary(id) {
  const [result] = await pool.query('DELETE FROM salaries WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function sumSalariesByStatus(status) {
  const [rows] = await pool.query(
    'SELECT COALESCE(SUM(amount), 0) AS total FROM salaries WHERE status = ?',
    [status]
  );
  return Number(rows[0].total);
}
