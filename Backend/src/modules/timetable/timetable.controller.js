import * as service from "./timetable.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

//  Create
export const createTimetable = asyncHandler(async (req, res) => {
  const data = await service.createTimetable(req.body);

  res.status(201).json(new ApiResponse(201, data, "Timetable created"));
});

//  Weekly
export const getWeeklyTimetable = asyncHandler(async (req, res) => {
  const { className, section } = req.query;

  const data = await service.getWeeklyTimetable(className, section);

  res.json(new ApiResponse(200, data));
});
