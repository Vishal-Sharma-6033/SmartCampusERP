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

