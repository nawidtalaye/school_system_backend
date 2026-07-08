// backend/controllers/classController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getClassesList,
  getClassDetail,
  addClass,
  editClass,
  removeClass,
} from '../services/classService.js';

export const listClassesHandler = asyncHandler(async (req, res) => {
  const result = await getClassesList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Classes fetched successfully', result.meta));
});

export const getClassHandler = asyncHandler(async (req, res) => {
  const cls = await getClassDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, cls, 'Class fetched successfully'));
});

export const createClassHandler = asyncHandler(async (req, res) => {
  const cls = await addClass(req.body);
  res.status(201).json(new ApiResponse(201, cls, 'Class created successfully'));
});

export const updateClassHandler = asyncHandler(async (req, res) => {
  const cls = await editClass(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, cls, 'Class updated successfully'));
});

export const deleteClassHandler = asyncHandler(async (req, res) => {
  await removeClass(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Class deleted successfully'));
});
