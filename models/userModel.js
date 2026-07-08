// backend/models/userModel.js
// Data-access layer for the "users" table. No business logic here —
// that belongs in services/.

import pool from '../config/database.js';

export async function findUserByEmailOrUsername(identifier) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1',
    [identifier, identifier]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, password, role, profile_image, status, last_login, created_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function updateLastLogin(id) {
  await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
}

export async function createUser({ full_name, username, email, password, role, profile_image }) {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, username, email, password, role, profile_image)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [full_name, username, email, password, role, profile_image || null]
  );
  return findUserById(result.insertId);
}

export async function updateUserPassword(id, hashedPassword) {
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
}

export async function listUsers({ limit, offset, search, role, status, sortBy = 'created_at', sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(full_name LIKE ? OR username LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (role) {
    whereClauses.push('role = ?');
    params.push(role);
  }
  if (status) {
    whereClauses.push('status = ?');
    params.push(status);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const allowedSort = ['created_at', 'full_name', 'username', 'email', 'role', 'status', 'last_login'];
  const safeSortBy = allowedSort.includes(sortBy) ? sortBy : 'created_at';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, role, profile_image, status, last_login, created_at
     FROM users ${whereSql}
     ORDER BY ${safeSortBy} ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM users ${whereSql}`,
    params
  );

  return { rows, total: countRows[0].total };
}

export async function updateUser(id, fields) {
  const allowed = ['full_name', 'username', 'email', 'role', 'status', 'profile_image'];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (setClauses.length === 0) return findUserById(id);

  params.push(id);
  await pool.query(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, params);
  return findUserById(id);
}

export async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
