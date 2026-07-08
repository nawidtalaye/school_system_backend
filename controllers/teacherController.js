// backend/controllers/teacherController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getTeachersList,
  getTeacherDetail,
  addTeacher,
  editTeacher,
  removeTeacher,
} from '../services/teacherService.js';

export const listTeachersHandler = asyncHandler(async (req, res) => {
  const result = await getTeachersList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Teachers fetched successfully', result.meta));
});

export const getTeacherHandler = asyncHandler(async (req, res) => {
  const teacher = await getTeacherDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, teacher, 'Teacher fetched successfully'));
});

export const createTeacherHandler = asyncHandler(async (req, res) => {
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const teacher = await addTeacher({ ...req.body, photo });
  res.status(201).json(new ApiResponse(201, teacher, 'Teacher created successfully'));
});

export const updateTeacherHandler = asyncHandler(async (req, res) => {
  const fields = { ...req.body };
  if (req.file) fields.photo = `/uploads/${req.file.filename}`;
  const teacher = await editTeacher(req.params.id, fields);
  res.status(200).json(new ApiResponse(200, teacher, 'Teacher updated successfully'));
});

export const deleteTeacherHandler = asyncHandler(async (req, res) => {
  await removeTeacher(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Teacher deleted successfully'));
});
