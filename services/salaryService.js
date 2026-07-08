// backend/services/salaryService.js

import pool from '../config/database.js';
import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listSalaries,
  findSalaryById,
  createSalary,
  markSalaryPaid,
  deleteSalary,
} from '../models/salaryModel.js';
import { logTransaction } from './transactionService.js';

export async function getSalariesList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { status, month, year, sortDir } = queryParams;
  const { rows, total } = await listSalaries({ limit, offset, status, month, year, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getSalaryDetail(id) {
  const salary = await findSalaryById(id);
  if (!salary) throw ApiError.notFound('Salary record not found.');
  return salary;
}

export async function addSalary(data) {
  return createSalary(data);
}

export async function paySalary(id, { payment_date }, requesterId) {
  const salary = await findSalaryById(id);
  if (!salary) throw ApiError.notFound('Salary record not found.');
  if (salary.status === 'Paid') throw ApiError.badRequest('This salary has already been paid.');

  const paymentDate = payment_date || new Date().toISOString().slice(0, 10);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const updated = await markSalaryPaid(connection, id, paymentDate);

    await logTransaction(connection, {
      amount: salary.amount,
      type: 'Salary',
      salary_id: salary.id,
      created_by: requesterId,
      status: 'Completed',
      notes: salary.teacher_id
        ? `Salary payment for teacher #${salary.teacher_id}`
        : `Salary payment for employee #${salary.employee_id}`,
    });

    await connection.commit();
    return updated;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function removeSalary(id) {
  const existing = await findSalaryById(id);
  if (!existing) throw ApiError.notFound('Salary record not found.');
  if (existing.status === 'Paid') {
    throw ApiError.badRequest('A paid salary record cannot be deleted.');
  }
  return deleteSalary(id);
}
