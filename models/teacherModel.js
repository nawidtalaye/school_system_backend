// backend/models/teacherModel.js

import pool from '../config/database.js';

export async function listTeachers({ limit, offset, search, status, sortBy = 'created_at', sortDir = 'DESC' }) {
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)');
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
    `SELECT * FROM teachers ${whereSql} ORDER BY ${safeSortBy} ${safeSortDir} LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );
  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM teachers ${whereSql}`, params);

  return { rows, total: countRows[0].total };
}

export async function findTeacherById(id) {
  const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

export async function findTeacherByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM teachers WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}

export async function createTeacher(data) {
  const [result] = await pool.query(
    `INSERT INTO teachers
      (photo, first_name, last_name, gender, phone, email, address, qualification, experience_years, salary, joining_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.photo || null,
      data.first_name,
      data.last_name,
      data.gender,
      data.phone,
      data.email,
      data.address || null,
      data.qualification || null,
      data.experience_years || 0,
      data.salary,
      data.joining_date,
      data.status || 'Active',
    ]
  );
  return findTeacherById(result.insertId);
}

export async function updateTeacher(id, data) {
  const allowed = [
    'photo', 'first_name', 'last_name', 'gender', 'phone', 'email',
    'address', 'qualification', 'experience_years', 'salary', 'joining_date', 'status',
  ];
  const setClauses = [];
  const params = [];

  for (const key of allowed) {
    if (data[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      params.push(data[key]);
    }
  }

  if (setClauses.length === 0) return findTeacherById(id);

  params.push(id);
  await pool.query(`UPDATE teachers SET ${setClauses.join(', ')} WHERE id = ?`, params);
  return findTeacherById(id);
}

export async function deleteTeacher(id) {
  const [result] = await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function countTotalTeachers() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM teachers WHERE status = 'Active'");
  return rows[0].total;
}
