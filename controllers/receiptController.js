// backend/controllers/receiptController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getReceiptsList, getReceiptDetail } from '../services/receiptService.js';

export const listReceiptsHandler = asyncHandler(async (req, res) => {
  const result = await getReceiptsList(req.query);
  res.status(200).json(new ApiResponse(200, result.data, 'Receipts fetched successfully', result.meta));
});

export const getReceiptHandler = asyncHandler(async (req, res) => {
  const receipt = await getReceiptDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, receipt, 'Receipt fetched successfully'));
});
