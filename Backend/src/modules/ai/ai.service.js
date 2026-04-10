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

export const generateRecommendations = async (studentId) => {
  const performance = await analyzePerformance(studentId);

  const recommendations = [];

  if (performance.percentage < 40) {
    recommendations.push("Focus on basics and revise daily.");
    recommendations.push("Watch concept videos on YouTube.");
    recommendations.push("Solve previous year papers.");
  }

  if (performance.percentage >= 40 && performance.percentage < 75) {
    recommendations.push("Practice more numerical problems.");
    recommendations.push("Improve weak subjects.");
  }

  if (performance.percentage >= 75) {
    recommendations.push("Start advanced topics.");
    recommendations.push("Participate in competitions.");
  }

  return {
    performance,
    recommendations,
  };
};