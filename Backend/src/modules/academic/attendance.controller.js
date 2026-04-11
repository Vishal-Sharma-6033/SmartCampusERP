import * as attendanceService from "./attendance.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

//  Mark Attendance
export const markAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.markAttendance(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Attendance marked", attendance));
});

//  Student Attendance
export const getStudentAttendance = asyncHandler(async (req, res) => {
  const data = await attendanceService.getStudentAttendance(
    req.params.studentId
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance fetched", data));
});

//  By Date
export const getAttendanceByDate = asyncHandler(async (req, res) => {
  const data = await attendanceService.getAttendanceByDate(req.query.date);

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance by date", data));
});

// delete attendance
export const deleteAttendance = asyncHandler(async (req, res) => {
  const { student, subject, date } = req.body;

  await attendanceService.deleteAttendance(student, subject, date);

  return res
    .status(200)
    .json(new ApiResponse(200, "Attendance removed"));
});