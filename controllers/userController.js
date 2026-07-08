// backend/controllers/userController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  registerUser,
  getUsersList,
  getUserDetail,
  editUser,
  removeUser,
} from '../services/userService.js';

export const createUserHandler = asyncHandler(async (req, res) => {
  const profile_image = req.file ? `/uploads/${req.file.filename}` : null;
  const user = await registerUser({ ...req.body, profile_image });
  res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
});

export const listUsersHandler = asyncHandler(async (req, res) => {
  const result = await getUsersList(req.query);
  res
    .status(200)
    .json(new ApiResponse(200, result.data, 'Users fetched successfully', result.meta));
});

export const getUserHandler = asyncHandler(async (req, res) => {
  const user = await getUserDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

export const updateUserHandler = asyncHandler(async (req, res) => {
  const fields = { ...req.body };
  if (req.file) {
    fields.profile_image = `/uploads/${req.file.filename}`;
  }
  const user = await editUser(req.params.id, fields);
  res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
});

export const deleteUserHandler = asyncHandler(async (req, res) => {
  await removeUser(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});
