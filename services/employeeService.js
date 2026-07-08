// backend/services/employeeService.js

import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listEmployees,
  findEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../models/employeeModel.js';

export async function getEmployeesList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, status, sortBy, sortDir } = queryParams;
  const { rows, total } = await listEmployees({ limit, offset, search, status, sortBy, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getEmployeeDetail(id) {
  const employee = await findEmployeeById(id);
  if (!employee) throw ApiError.notFound('Employee not found.');
  return employee;
}

export async function addEmployee(data) {
  return createEmployee(data);
}

export async function editEmployee(id, data) {
  const existing = await findEmployeeById(id);
  if (!existing) throw ApiError.notFound('Employee not found.');
  return updateEmployee(id, data);
}

export async function removeEmployee(id) {
  const existing = await findEmployeeById(id);
  if (!existing) throw ApiError.notFound('Employee not found.');
  return deleteEmployee(id);
}
