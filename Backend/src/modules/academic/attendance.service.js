import Attendance from "./attendance.model.js";

//  Mark Attendance
export const markAttendance = async (data) => {
  return await Attendance.create(data);
};

//  Get Student Attendance
export const getStudentAttendance = async (studentId) => {
  return await Attendance.find({ student: studentId })
    .populate("subject", "name")
    .sort({ date: -1 });
};

//  Get Attendance By Date
export const getAttendanceByDate = async (date) => {
  return await Attendance.find({ date });
};