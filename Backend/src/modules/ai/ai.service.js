import Exam from "../exam/exam.model.js";
import Assignment from "../assignment/assignment.model.js";
import User from "../user/user.model.js";

// ===============================
// 🤖 CHATBOT (NO OPENAI REQUIRED)
// ===============================
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