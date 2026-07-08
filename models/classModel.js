// backend/models/classModel.js

import pool from '../config/database.js';

export async function listClasses({ limit, offset, search, status, sortBy = 'created_at', sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(c.class_name LIKE ? OR c.section LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) {
    whereClauses.push('c.status = ?');
    params.push(status);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const allowedSort = ['created_at', 'class_name', 'section', 'capacity', 'status'];
  const safeSortBy = allowedSort.includes(sortBy) ? `c.${sortBy}` : 'c.created_at';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT c.*, CONCAT(t.first_name, ' ', t.last_name) AS class_teacher_name
     FROM classes c
     LEFT JOIN teachers t ON t.id = c.class_teacher_id
     ${whereSql}
     ORDER BY ${safeSortBy} ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM classes c ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findClassById(id) {
  const [rows] = await pool.query(
    `SELECT c.*, CONCAT(t.first_name, ' ', t.last_name) AS class_teacher_name
     FROM classes c
     LEFT JOIN teachers t ON t.id = c.class_teacher_id
     WHERE c.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function createClass(data) {
  const [result] = await pool.query(
    `INSERT INTO classes (class_name, section, capacity, class_teacher_id, status)
     VALUES (?, ?, ?, ?, ?)`,
    [data.class_name, data.section, data.capacity, data.class_teacher_id || null, data.status || 'Active']
  );
  return findClassById(result.insertId);
}

export async function updateClass(id, data) {
  const allowed = ['class_name', 'section', 'capacity', 'class_teacher_id', 'status'];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return findClassById(id);

  params.push(id);
  await pool.query(`UPDATE classes SET ${setClauses.join(', ')} WHERE id = ?`, params);
  return findClassById(id);
}

export async function deleteClass(id) {
  const [result] = await pool.query('DELETE FROM classes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function countTotalClasses() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM classes WHERE status = 'Active'");
  return rows[0].total;
}
