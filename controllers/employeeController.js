// backend/controllers/employeeController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getEmployeesList,
  getEmployeeDetail,
  addEmployee,
  editEmployee,
  removeEmployee,
} from '../services/employeeService.js';

export const listEmployeesHandler = asyncHandler(async (req, res) => {
  const result = await getEmployeesList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Employees fetched successfully', result.meta));
});

export const getEmployeeHandler = asyncHandler(async (req, res) => {
  const employee = await getEmployeeDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, employee, 'Employee fetched successfully'));
});

export const createEmployeeHandler = asyncHandler(async (req, res) => {
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const employee = await addEmployee({ ...req.body, photo });
  res.status(201).json(new ApiResponse(201, employee, 'Employee created successfully'));
});

export const updateEmployeeHandler = asyncHandler(async (req, res) => {
  const fields = { ...req.body };
  if (req.file) fields.photo = `/uploads/${req.file.filename}`;
  const employee = await editEmployee(req.params.id, fields);
  res.status(200).json(new ApiResponse(200, employee, 'Employee updated successfully'));
});

export const deleteEmployeeHandler = asyncHandler(async (req, res) => {
  await removeEmployee(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Employee deleted successfully'));
});
