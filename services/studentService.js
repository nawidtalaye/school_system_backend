// backend/services/studentService.js

import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listStudents,
  findStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../models/studentModel.js';

export async function getStudentsList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, status, classId, sortBy, sortDir } = queryParams;
  const { rows, total } = await listStudents({ limit, offset, search, status, classId, sortBy, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getStudentDetail(id) {
  const student = await findStudentById(id);
  if (!student) throw ApiError.notFound('Student not found.');
  return student;
}

export async function addStudent(data) {
  return createStudent(data);
}

export async function editStudent(id, data) {
  const existing = await findStudentById(id);
  if (!existing) throw ApiError.notFound('Student not found.');
  return updateStudent(id, data);
}

export async function removeStudent(id) {
  const existing = await findStudentById(id);
  if (!existing) throw ApiError.notFound('Student not found.');
  return deleteStudent(id);
}
