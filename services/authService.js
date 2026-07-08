// backend/services/authService.js
// Business logic for authentication. Controllers stay thin and call these.

import bcrypt from 'bcrypt';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import {
  findUserByEmailOrUsername,
  findUserById,
  updateLastLogin,
  updateUserPassword,
} from '../models/userModel.js';

export async function loginUser({ identifier, password }) {
  const user = await findUserByEmailOrUsername(identifier);

  if (!user) {
    throw ApiError.unauthorized('Invalid credentials.');
  }

  if (user.status !== 'Active') {
    throw ApiError.forbidden('This account has been deactivated. Contact an administrator.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid credentials.');
  }

  await updateLastLogin(user.id);

  const payload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const safeUser = {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profile_image,
  };

  return { user: safeUser, accessToken, refreshToken };
}

export async function changePassword({ userId, currentPassword, newPassword }) {
  const user = await findUserById(userId);
  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentValid) {
    throw ApiError.badRequest('Current password is incorrect.');
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(userId, hashed);
  return true;
}
