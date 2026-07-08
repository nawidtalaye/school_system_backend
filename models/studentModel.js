// backend/models/studentModel.js

import pool from '../config/database.js';

export async function listStudents({ limit, offset, search, status, classId, sortBy = 'created_at', sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(s.first_name LIKE ? OR s.last_name LIKE ? OR s.guardian_name LIKE ? OR s.phone LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    whereClauses.push('s.status = ?');
    params.push(status);
  }
  if (classId) {
    whereClauses.push('s.class_id = ?');
    params.push(classId);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const allowedSort = ['created_at', 'first_name', 'last_name', 'admission_date', 'status'];
  const safeSortBy = allowedSort.includes(sortBy) ? `s.${sortBy}` : 's.created_at';
  const safeSortDir = sortDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const [rows] = await pool.query(
    `SELECT s.*, c.class_name, c.section
     FROM students s
     LEFT JOIN classes c ON c.id = s.class_id
     ${whereSql}
     ORDER BY ${safeSortBy} ${safeSortDir}
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM students s ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findStudentById(id) {
  const [rows] = await pool.query(
    `SELECT s.*, c.class_name, c.section
     FROM students s
     LEFT JOIN classes c ON c.id = s.class_id
     WHERE s.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function createStudent(data) {
  const [result] = await pool.query(
    `INSERT INTO students
      (photo, first_name, last_name, gender, date_of_birth, guardian_name, phone, email, address, class_id, admission_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.photo || null,
      data.first_name,
      data.last_name,
      data.gender,
      data.date_of_birth,
      data.guardian_name,
      data.phone,
      data.email || null,
      data.address || null,
      data.class_id || null,
      data.admission_date,
      data.status || 'Active',
    ]
  );
  return findStudentById(result.insertId);
}

export async function updateStudent(id, data) {
  const allowed = [
    'photo', 'first_name', 'last_name', 'gender', 'date_of_birth', 'guardian_name',
    'phone', 'email', 'address', 'class_id', 'admission_date', 'status',
  ];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return findStudentById(id);

  params.push(id);
  await pool.query(`UPDATE students SET ${setClauses.join(', ')} WHERE id = ?`, params);
  return findStudentById(id);
}

export async function deleteStudent(id) {
  const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function countTotalStudents() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM students WHERE status = 'Active'");
  return rows[0].total;
}
