// backend/services/teacherService.js

import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listTeachers,
  findTeacherById,
  findTeacherByEmail,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../models/teacherModel.js';

export async function getTeachersList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, status, sortBy, sortDir } = queryParams;
  const { rows, total } = await listTeachers({ limit, offset, search, status, sortBy, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getTeacherDetail(id) {
  const teacher = await findTeacherById(id);
  if (!teacher) throw ApiError.notFound('Teacher not found.');
  return teacher;
}

export async function addTeacher(data) {
  const existing = await findTeacherByEmail(data.email);
  if (existing) throw ApiError.conflict('A teacher with this email already exists.');
  return createTeacher(data);
}

export async function editTeacher(id, data) {
  const existing = await findTeacherById(id);
  if (!existing) throw ApiError.notFound('Teacher not found.');
  return updateTeacher(id, data);
}

export async function removeTeacher(id) {
  const existing = await findTeacherById(id);
  if (!existing) throw ApiError.notFound('Teacher not found.');
  return deleteTeacher(id);
}
