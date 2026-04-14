import User from "../user/user.model.js";
import Exam from "../exam/exam.model.js";
import Result from "../exam/result.model.js";
import Assignment from "../assignment/assignment.model.js";
import Attendance from "../academic/attendance.model.js"; // if exists

//  DASHBOARD SUMMARY
export const getDashboardStats = async () => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });
  const totalExams = await Exam.countDocuments();
  const totalAssignments = await Assignment.countDocuments();

  return {
    totalStudents,
    totalTeachers,
    totalExams,
    totalAssignments,
  };
};


//  ATTENDANCE ANALYTICS
export const getAttendanceAnalytics = async () => {
  const data = await Attendance.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return data;
};

//  PERFORMANCE ANALYTICS
export const getPerformanceAnalytics = async () => {
  const result = await Result.aggregate([
    {
      $group: {
        _id: "$subject",
        avgMarks: { $avg: "$marksObtained" },
      },
    },
  ]);

  return result;
};

//  SYSTEM USAGE (LAST 7 DAYS USERS CREATED)
export const getSystemUsage = async () => {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const users = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: last7Days },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        count: { $sum: 1 },
      },
    },
  ]);

  return users;
};

//  RECENT ACTIVITY
export const getRecentActivity = async () => {
  const exams = await Exam.find().sort({ createdAt: -1 }).limit(5);
  const assignments = await Assignment.find().sort({ createdAt: -1 }).limit(5);

  return {
    recentExams: exams,
    recentAssignments: assignments,
  };
};