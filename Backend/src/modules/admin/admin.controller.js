import * as adminService from "./admin.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";



// get all logs
export const getLogs = asyncHandler(async (req, res) => {
    const logs = await adminService.getAuditLogs();
    res.status(200).json(new ApiResponse("Audit logs fetched successfully", logs));
});

//  UPDATE SETTINGS
export const updateSetting = asyncHandler(async (req, res) => {
  const { key, value } = req.body;
  const setting = await adminService.setSetting(key, value);

  res.json(new ApiResponse(200, setting, "Setting updated"));
});

// GET SETTINGS
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.getSettings();
  res.json(new ApiResponse(200, settings, "Settings fetched"));
});





