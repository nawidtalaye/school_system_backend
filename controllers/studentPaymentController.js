// backend/controllers/studentPaymentController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
  getStudentPaymentsList,
  getStudentPaymentDetail,
  addStudentPayment,
  changeStudentPaymentStatus,
} from '../services/studentPaymentService.js';

export const listStudentPaymentsHandler = asyncHandler(async (req, res) => {
  const result = await getStudentPaymentsList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Student payments fetched successfully', result.meta));
});

export const getStudentPaymentHandler = asyncHandler(async (req, res) => {
  const payment = await getStudentPaymentDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, payment, 'Student payment fetched successfully'));
});

export const createStudentPaymentHandler = asyncHandler(async (req, res) => {
  const payment = await addStudentPayment(req.body, req.user.id);
  res.status(201).json(new ApiResponse(201, payment, 'Student payment recorded successfully'));
});

export const updateStudentPaymentStatusHandler = asyncHandler(async (req, res) => {
  const payment = await changeStudentPaymentStatus(req.params.id, req.body.status);
  res.status(200).json(new ApiResponse(200, payment, 'Student payment status updated successfully'));
});
