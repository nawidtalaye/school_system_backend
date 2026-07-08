// backend/controllers/transactionController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getTransactionsList, getTransactionDetail } from '../services/transactionService.js';

export const listTransactionsHandler = asyncHandler(async (req, res) => {
  const result = await getTransactionsList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Transactions fetched successfully', result.meta));
});

export const getTransactionHandler = asyncHandler(async (req, res) => {
  const transaction = await getTransactionDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, transaction, 'Transaction fetched successfully'));
});
