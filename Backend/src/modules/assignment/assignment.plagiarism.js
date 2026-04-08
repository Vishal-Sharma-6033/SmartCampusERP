import asyncHandlers from "../../utils/asyncHandler.js";
import Submission from "./submission.model.js";

// simple text similarity
const getSimilarity = (text1, text2) => {
  const a = text1.split(" ");
  const b = text2.split(" ");

  const common = a.filter(word => b.includes(word));
  return (common.length / Math.max(a.length, b.length)) * 100;
};

export const checkPlagiarism = asyncHandlers( async (assignmentId) => {
  const submissions = await Submission.find({ assignmentId });

  let results = [];

  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      const sim = getSimilarity(
        submissions[i].text || "",
        submissions[j].text || ""
      );

      if (sim > 40) {
        results.push({
          student1: submissions[i].studentId,
          student2: submissions[j].studentId,
          similarity: sim,
        });
      }
    }
  }

  return results;
});