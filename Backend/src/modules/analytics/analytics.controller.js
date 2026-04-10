import * as analyticsService from "./analytics.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

// 📊 FULL DASHBOARD
export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  // const attendance = await analyticsService.getAttendanceAnalytics();
  const performance = await analyticsService.getPerformanceAnalytics();
  const usage = await analyticsService.getSystemUsage();
  const activity = await analyticsService.getRecentActivity();

  

  return res.status(200).json(
    new ApiResponse(200, "Dashboard data fetched", {
      stats,
      // attendance,
      performance,
      usage,
      activity
    })
  );
});