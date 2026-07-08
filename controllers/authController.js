// backend/controllers/authController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { loginUser, changePassword } from '../services/authService.js';
import { generateAccessToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { findUserById } from '../models/userModel.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser({ identifier, password });

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json(new ApiResponse(200, { user, accessToken }, 'Logged in successfully'));
});

export const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw ApiError.unauthorized('Refresh token missing.');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token.');
  }

  const user = await findUserById(decoded.id);
  if (!user || user.status !== 'Active') {
    throw ApiError.unauthorized('User no longer active.');
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 })
    .status(200)
    .json(new ApiResponse(200, { accessToken }, 'Access token refreshed'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'Current user fetched'));
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changePassword({ userId: req.user.id, currentPassword, newPassword });
  res.status(200).json(new ApiResponse(200, null, 'Password updated successfully'));
});
