// backend/services/subjectService.js

import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listSubjects,
  findSubjectById,
  findSubjectByCode,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../models/subjectModel.js';

export async function getSubjectsList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, status, sortBy, sortDir } = queryParams;
  const { rows, total } = await listSubjects({ limit, offset, search, status, sortBy, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getSubjectDetail(id) {
  const subject = await findSubjectById(id);
  if (!subject) throw ApiError.notFound('Subject not found.');
  return subject;
}

export async function addSubject(data) {
  const existing = await findSubjectByCode(data.code);
  if (existing) throw ApiError.conflict('A subject with this code already exists.');
  return createSubject(data);
}

export async function editSubject(id, data) {
  const existing = await findSubjectById(id);
  if (!existing) throw ApiError.notFound('Subject not found.');
  return updateSubject(id, data);
}

export async function removeSubject(id) {
  const existing = await findSubjectById(id);
  if (!existing) throw ApiError.notFound('Subject not found.');
  return deleteSubject(id);
}
