// backend/controllers/dashboardController.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getDashboardOverview } from '../services/dashboardService.js';

export const getDashboardHandler = asyncHandler(async (req, res) => {
  const overview = await getDashboardOverview();
  res.status(200).json(new ApiResponse(200, overview, 'Dashboard data fetched successfully'));
});
