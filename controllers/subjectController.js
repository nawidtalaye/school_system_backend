// backend/controllers/subjectController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getSubjectsList,
  getSubjectDetail,
  addSubject,
  editSubject,
  removeSubject,
} from '../services/subjectService.js';

export const listSubjectsHandler = asyncHandler(async (req, res) => {
  const result = await getSubjectsList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Subjects fetched successfully', result.meta));
});

export const getSubjectHandler = asyncHandler(async (req, res) => {
  const subject = await getSubjectDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, subject, 'Subject fetched successfully'));
});

export const createSubjectHandler = asyncHandler(async (req, res) => {
  const subject = await addSubject(req.body);
  res.status(201).json(new ApiResponse(201, subject, 'Subject created successfully'));
});

export const updateSubjectHandler = asyncHandler(async (req, res) => {
  const subject = await editSubject(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, subject, 'Subject updated successfully'));
});

export const deleteSubjectHandler = asyncHandler(async (req, res) => {
  await removeSubject(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Subject deleted successfully'));
});
