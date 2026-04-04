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

//current day
export const getCurrentTimetable = asyncHandler(async (req, res) => {
  const { className, section } = req.query;

  const data = await service.getCurrentTimetable(className, section);

  res.json(new ApiResponse(200, data));
});

//  Date-wise
export const getTimetableByDate = asyncHandler(async (req, res) => {
  const { date, className, section } = req.query;

  const data = await service.getTimetableByDate(date, className, section);

  res.json(new ApiResponse(200, data));
});

//smart timetable generation
export const generateTimetable = asyncHandler(async (req, res) => {
  const data = await service.generateSmartTimetable(req.body);

  res.json(new ApiResponse(200, data, "Smart timetable generated"));
});