// backend/services/userService.js

import bcrypt from 'bcrypt';
import ApiError from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';
import {
  createUser,
  findUserByEmailOrUsername,
  findUserById,
  listUsers,
  updateUser,
  deleteUser,
} from '../models/userModel.js';

export async function registerUser(payload) {
  const existing = await findUserByEmailOrUsername(payload.email) ||
    await findUserByEmailOrUsername(payload.username);

  if (existing) {
    throw ApiError.conflict('A user with this email or username already exists.');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await createUser({ ...payload, password: hashedPassword });
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function getUsersList(queryParams) {
  const { page, limit, offset } = getPagination(queryParams);
  const { search, role, status, sortBy, sortDir } = queryParams;

  const { rows, total } = await listUsers({ limit, offset, search, role, status, sortBy, sortDir });

  return { data: rows, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getUserDetail(id) {
  const user = await findUserById(id);
  if (!user) throw ApiError.notFound('User not found.');
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function editUser(id, fields) {
  const existing = await findUserById(id);
  if (!existing) throw ApiError.notFound('User not found.');

  const updated = await updateUser(id, fields);
  const { password, ...safeUser } = updated;
  return safeUser;
}

export async function removeUser(id, requesterId) {
  if (Number(id) === Number(requesterId)) {
    throw ApiError.badRequest('You cannot delete your own account.');
  }

  const existing = await findUserById(id);
  if (!existing) throw ApiError.notFound('User not found.');

  return deleteUser(id);
}
