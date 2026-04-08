import * as service from "./assignment.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { checkPlagiarism } from "./assignment.plagiarism.js";
import { getAnalytics } from "./assignment.analytics.js";

export const createAssignment = asyncHandler(async (req, res,) => {
  const data = await service.createAssignment(req.body, req.user);

  res.json(new ApiResponse(201, data, "Assignment created"));
});

export const submitAssignment = asyncHandler(async (req, res) => {
  const data = await service.submitAssignment(
    req.params.id,
    req.body,
    req.user
  );
  console.log("DATA =>", data); // 👈 ADD THIS

  res.status(200).json(
  new ApiResponse(200, data, "Assignment submitted")
);
});

export const getStudentAssignments = asyncHandler(async (req, res) => {
  const data = await service.getStudentAssignments(
    req.params.id,
    
  );

  res.json(new ApiResponse(200, data));
});

export const gradeSubmission = asyncHandler(async (req, res) => {
  const data = await service.gradeSubmission(
    req.params.submissionId,
    req.body
  );

  res.json(new ApiResponse(200, data, "Graded successfully"));
});



export const plagiarismCheck = asyncHandler(async (req, res) => {
  const data = await checkPlagiarism(req.params.id);
  res.json(new ApiResponse(200, data));
});

export const analytics = asyncHandler(async (req, res) => {
  const data = await getAnalytics(req.params.id);
  res.json(new ApiResponse(200, data));
});

export const subjectFeed = asyncHandler(async (req, res) => {
  const data = await service.getAssignmentsBySubject(req.params.subjectId);
  res.json(new ApiResponse(200, data));
});