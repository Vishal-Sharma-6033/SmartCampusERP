import * as analyticsService from "./analytics.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

// 📊 FULL DASHBOARD
export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  

  return res.status(200).json(
    new ApiResponse(200, "Dashboard data fetched", {
      stats
      
    })
  );
});