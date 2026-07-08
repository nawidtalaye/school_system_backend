// backend/controllers/salaryController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getSalariesList,
  getSalaryDetail,
  addSalary,
  paySalary,
  removeSalary,
} from '../services/salaryService.js';

export const listSalariesHandler = asyncHandler(async (req, res) => {
  const result = await getSalariesList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Salaries fetched successfully', result.meta));
});

export const getSalaryHandler = asyncHandler(async (req, res) => {
  const salary = await getSalaryDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, salary, 'Salary record fetched successfully'));
});

export const createSalaryHandler = asyncHandler(async (req, res) => {
  const salary = await addSalary(req.body);
  res.status(201).json(new ApiResponse(201, salary, 'Salary record created successfully'));
});

export const paySalaryHandler = asyncHandler(async (req, res) => {
  const salary = await paySalary(req.params.id, req.body, req.user.id);
  res.status(200).json(new ApiResponse(200, salary, 'Salary marked as paid successfully'));
});

export const deleteSalaryHandler = asyncHandler(async (req, res) => {
  await removeSalary(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Salary record deleted successfully'));
});
