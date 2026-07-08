// backend/models/dashboardModel.js

import pool from '../config/database.js';

export async function getCounts() {
  const [[students]] = await pool.query("SELECT COUNT(*) AS count FROM students WHERE status = 'Active'");
  const [[teachers]] = await pool.query("SELECT COUNT(*) AS count FROM teachers WHERE status = 'Active'");
  const [[users]] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE status = 'Active'");
  const [[classes]] = await pool.query("SELECT COUNT(*) AS count FROM classes WHERE status = 'Active'");
  const [[subjects]] = await pool.query("SELECT COUNT(*) AS count FROM subjects WHERE status = 'Active'");

  return {
    totalStudents: students.count,
    totalTeachers: teachers.count,
    totalUsers: users.count,
    totalClasses: classes.count,
    totalSubjects: subjects.count,
  };
}

export async function getSalaryStats() {
  const [[paid]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM salaries WHERE status = 'Paid'");
  const [[pending]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM salaries WHERE status = 'Pending'");

  return {
    totalSalariesPaid: Number(paid.total),
    pendingSalaries: Number(pending.total),
  };
}

export async function getPaymentStats() {
  const [[total]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM student_payments WHERE status = 'Completed'");
  const [[today]] = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) AS total FROM student_payments WHERE status = 'Completed' AND payment_date = CURDATE()"
  );
  const [[month]] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM student_payments
     WHERE status = 'Completed' AND MONTH(payment_date) = MONTH(CURDATE()) AND YEAR(payment_date) = YEAR(CURDATE())`
  );

  return {
    totalStudentPayments: Number(total.total),
    todaysIncome: Number(today.total),
    monthlyIncome: Number(month.total),
  };
}

export async function getRecentTransactions(limit = 5) {
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

export async function getMonthlyIncomeChart(monthsBack = 6) {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(payment_date, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS total
     FROM student_payments
     WHERE status = 'Completed' AND payment_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
     GROUP BY month
     ORDER BY month ASC`,
    [monthsBack]
  );
  return rows;
}

export async function getRecentActivity(limit = 10) {
  const [rows] = await pool.query(
    `(SELECT 'student' AS entity, CONCAT(first_name, ' ', last_name) AS label, created_at FROM students ORDER BY created_at DESC LIMIT ?)
     UNION ALL
     (SELECT 'teacher' AS entity, CONCAT(first_name, ' ', last_name) AS label, created_at FROM teachers ORDER BY created_at DESC LIMIT ?)
     UNION ALL
     (SELECT 'payment' AS entity, CONCAT('Payment #', id) AS label, created_at FROM student_payments ORDER BY created_at DESC LIMIT ?)
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit, limit, limit, limit]
  );
  return rows;
}
