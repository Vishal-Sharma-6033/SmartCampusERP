import asyncHandlers from "../../utils/asyncHandler.js";
import Submission from "./submission.model.js";

export const getAnalytics =  async (assignmentId) => {
  const submissions = await Submission.find({ assignmentId });

  const total = submissions.length;

  const graded = submissions.filter(s => s.marks !== null);

  const avgMarks =
    graded.reduce((sum, s) => sum + s.marks, 0) / (graded.length || 1);

  const lateCount = submissions.filter(s => s.status === "late").length;

  return {
    totalSubmissions: total,
    avgMarks,
    submissionRate: total,
    latePercentage: (lateCount / (total || 1)) * 100,
  };
};