import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  createSubjectService,
  getSubjectsService,
  getSubjectByIdService,
  getStudentDashboardService,
  updateSubjectService,
  deleteSubjectService,
  addStudentToSubjectService,
  removeStudentFromSubjectService,
} from "./academic.service.js";

// CREATE
export const createSubject = asyncHandler(async (req, res) => {
  const subject = await createSubjectService(req.body);
  res.status(201).json(new ApiResponse(201, subject, "Subject created"));
});

// GET ALL
export const getSubjects = asyncHandler(async (req, res) => {
  const { semester } = req.query;
  const subjects = await getSubjectsService(semester);

  res.json(new ApiResponse(200, subjects));
});

// GET BY ID
export const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await getSubjectByIdService(req.params.id);
  res.json(new ApiResponse(200, subject));
});

// STUDENT DASHBOARD
export const getStudentDashboard = asyncHandler(async (req, res) => {
  const data = await getStudentDashboardService(req.params.studentId);
  res.json(new ApiResponse(200, data));
});

// UPDATE
export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await updateSubjectService(req.params.id, req.body);
  res.json(new ApiResponse(200, subject, "Updated"));
});

// DELETE
export const deleteSubject = asyncHandler(async (req, res) => {
  await deleteSubjectService(req.params.id);
  res.json(new ApiResponse(200, null, "Deleted"));
});

// ADD STUDENT
export const addStudent = asyncHandler(async (req, res) => {
  const subject = await addStudentToSubjectService(
    req.params.id,
    req.body.studentId
  );

  res.json(new ApiResponse(200, subject, "Student added"));
});

// REMOVE STUDENT
export const removeStudent = asyncHandler(async (req, res) => {
  const subject = await removeStudentFromSubjectService(
    req.params.id,
    req.body.studentId
  );

  res.json(new ApiResponse(200, subject, "Student removed"));
});