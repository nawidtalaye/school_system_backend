// backend/controllers/studentController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getStudentsList,
  getStudentDetail,
  addStudent,
  editStudent,
  removeStudent,
} from '../services/studentService.js';

export const listStudentsHandler = asyncHandler(async (req, res) => {
  const result = await getStudentsList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Students fetched successfully', result.meta));
});

export const getStudentHandler = asyncHandler(async (req, res) => {
  const student = await getStudentDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, student, 'Student fetched successfully'));
});

export const createStudentHandler = asyncHandler(async (req, res) => {
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const student = await addStudent({ ...req.body, photo });
  res.status(201).json(new ApiResponse(201, student, 'Student created successfully'));
});

export const updateStudentHandler = asyncHandler(async (req, res) => {
  const fields = { ...req.body };
  if (req.file) fields.photo = `/uploads/${req.file.filename}`;
  const student = await editStudent(req.params.id, fields);
  res.status(200).json(new ApiResponse(200, student, 'Student updated successfully'));
});

export const deleteStudentHandler = asyncHandler(async (req, res) => {
  await removeStudent(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Student deleted successfully'));
});
