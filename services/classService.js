// backend/services/classService.js

import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  listClasses,
  findClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../models/classModel.js';

export async function getClassesList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, status, sortBy, sortDir } = queryParams;
  const { rows, total } = await listClasses({ limit, offset, search, status, sortBy, sortDir });
  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getClassDetail(id) {
  const cls = await findClassById(id);
  if (!cls) throw ApiError.notFound('Class not found.');
  return cls;
}

export async function addClass(data) {
  return createClass(data);
}

export async function editClass(id, data) {
  const existing = await findClassById(id);
  if (!existing) throw ApiError.notFound('Class not found.');
  return updateClass(id, data);
}

export async function removeClass(id) {
  const existing = await findClassById(id);
  if (!existing) throw ApiError.notFound('Class not found.');
  return deleteClass(id);
}
