// backend/models/employeeModel.js

import pool from '../config/database.js';

export async function listEmployees({ limit, offset, search, status, sortBy = 'created_at', sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(first_name LIKE ? OR last_name LIKE ? OR designation LIKE ? OR phone LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    whereClauses.push('status = ?');
    params.push(status);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const allowedSort = ['created_at', 'first_name', 'last_name', 'salary', 'joining_date', 'status'];
  const safeSortBy = allowedSort.includes(sortBy) ? sortBy : 'created_at';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT * FROM employees ${whereSql} ORDER BY ${safeSortBy} ${safeSortDir} LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM employees ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findEmployeeById(id) {
  const [rows] = await pool.query('SELECT * FROM employees WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function createEmployee(data) {
  const [result] = await pool.query(
    `INSERT INTO employees (photo, first_name, last_name, designation, phone, email, address, salary, joining_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.photo || null,
      data.first_name,
      data.last_name,
      data.designation,
      data.phone,
      data.email || null,
      data.address || null,
      data.salary,
      data.joining_date,
      data.status || 'Active',
    ]
  );
  return findEmployeeById(result.insertId);
}

export async function updateEmployee(id, data) {
  const allowed = ['photo', 'first_name', 'last_name', 'designation', 'phone', 'email', 'address', 'salary', 'joining_date', 'status'];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return findEmployeeById(id);

  params.push(id);
  await pool.query(`UPDATE employees SET ${setClauses.join(', ')} WHERE id = ?`, params);
  return findEmployeeById(id);
}

export async function deleteEmployee(id) {
  const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
