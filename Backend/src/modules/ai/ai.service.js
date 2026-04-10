import Exam from "../exam/exam.model.js";
import Assignment from "../assignment/assignment.model.js";
import User from "../user/user.model.js";


export const generateChatResponse = async (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("exam")) {
    return "Your upcoming exams will be available in the exam section.";
  }

  if (msg.includes("assignment")) {
    return "Check your assignment dashboard for pending tasks.";
  }

  if (msg.includes("attendance")) {
    return "Attendance data is updated daily in your profile.";
  }

  return "I'm your Smart Campus AI assistant. Ask about exams, assignments, or performance!";
};

export const analyzePerformance = async (studentId) => {
  const exams = await Exam.find({ student: studentId });
  const assignments = await Assignment.find({ student: studentId });

  let totalMarks = 0;
  let obtainedMarks = 0;

  exams.forEach((exam) => {
    totalMarks += exam.totalMarks || 0;
    obtainedMarks += exam.obtainedMarks || 0;
  });

  assignments.forEach((a) => {
    totalMarks += a.totalMarks || 0;
    obtainedMarks += a.marksObtained || 0;
  });

  const percentage = totalMarks ? (obtainedMarks / totalMarks) * 100 : 0;

  let performanceLevel = "Average";

  if (percentage > 80) performanceLevel = "Excellent";
  else if (percentage < 40) performanceLevel = "Needs Improvement";

  return {
    totalMarks,
    obtainedMarks,
    percentage: percentage.toFixed(2),
    performanceLevel,
  };
};