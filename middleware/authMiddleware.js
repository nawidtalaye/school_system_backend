// backend/middleware/authMiddleware.js
// Verifies the JWT (from httpOnly cookie or Authorization header) and
// attaches the decoded user to req.user. Use on every protected route.

import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import { findUserById } from '../models/userModel.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const tokenFromCookie = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    throw ApiError.unauthorized('Access token missing. Please log in.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Session expired. Please log in again.');
    }
    throw ApiError.unauthorized('Invalid access token.');
  }

  const user = await findUserById(decoded.id);

  if (!user) {
    throw ApiError.unauthorized('User no longer exists.');
  }

  if (user.status !== 'Active') {
    throw ApiError.forbidden('This account has been deactivated.');
  }

  req.user = {
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profile_image,
    lastLogin: user.last_login,
  };

  next();
});

export default authMiddleware;
