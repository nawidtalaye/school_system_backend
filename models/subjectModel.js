// backend/models/subjectModel.js

import pool from '../config/database.js';

export async function listSubjects({ limit, offset, search, status, sortBy = 'created_at', sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(s.subject_name LIKE ? OR s.code LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (status) {
    whereClauses.push('s.status = ?');
    params.push(status);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const allowedSort = ['created_at', 'subject_name', 'code', 'status'];
  const safeSortBy = allowedSort.includes(sortBy) ? `s.${sortBy}` : 's.created_at';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT s.*, CONCAT(t.first_name, ' ', t.last_name) AS teacher_name, c.class_name, c.section
     FROM subjects s
     LEFT JOIN teachers t ON t.id = s.teacher_id
     LEFT JOIN classes c ON c.id = s.class_id
     ${whereSql}
     ORDER BY ${safeSortBy} ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM subjects s ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findSubjectById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, CONCAT(t.first_name, ' ', t.last_name) AS teacher_name, c.class_name, c.section
     FROM subjects s
     LEFT JOIN teachers t ON t.id = s.teacher_id
     LEFT JOIN classes c ON c.id = s.class_id
     WHERE s.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function findSubjectByCode(code) {
  const [rows] = await pool.query('SELECT * FROM subjects WHERE code = ? LIMIT 1', [code]);
  return rows[0] || null;
}

export async function createSubject(data) {
  const [result] = await pool.query(
    `INSERT INTO subjects (subject_name, code, teacher_id, class_id, status) VALUES (?, ?, ?, ?, ?)`,
    [data.subject_name, data.code, data.teacher_id || null, data.class_id || null, data.status || 'Active']
  );
  return findSubjectById(result.insertId);
}

export async function updateSubject(id, data) {
  const allowed = ['subject_name', 'code', 'teacher_id', 'class_id', 'status'];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return findSubjectById(id);

  params.push(id);
  await pool.query(`UPDATE subjects SET ${setClauses.join(', ')} WHERE id = ?`, params);
  return findSubjectById(id);
}

export async function deleteSubject(id) {
  const [result] = await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function countTotalSubjects() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM subjects WHERE status = 'Active'");
  return rows[0].total;
}
