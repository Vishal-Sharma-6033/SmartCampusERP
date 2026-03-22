import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  createSubjectService,
  getSubjectsBySemesterService,
  getSubjectByIdService,
  getStudentDashboardService,
} from "./academic.service.js";
import {
  updateSubjectService,
  deleteSubjectService,
  addStudentToSubjectService,
  removeStudentFromSubjectService,
} from "./academic.service.js";


// CREATE SUBJECT
export const createSubject = asyncHandler(async (req, res) => {
  const subject = await createSubjectService(req.body, req.tenantId);
  res.status(201).json(new ApiResponse(201, subject, "Subject created"));
});

// GET SUBJECT
export const getSubjects = asyncHandler(async (req, res) => {
  const { semester } = req.query;
  const subjects = await getSubjectsBySemesterService(semester, req.tenantId);

  res.json(new ApiResponse(200, subjects));
});

// GET SUBJECT BY ID
export const getSubjectById = asyncHandler(async (req, res) => {
  const subject = await getSubjectByIdService(req.params.id, req.tenantId);

  res.json(new ApiResponse(200, subject));
});

// GET STUDENT DASHBOARD
export const getStudentDashboard = asyncHandler(async (req, res) => {
  const data = await getStudentDashboardService(
    req.params.studentId,
    req.tenantId,
  );

  res.json(new ApiResponse(200, data));
});

//  UPDATE
export const updateSubject = asyncHandler(async (req, res) => {
  const subject = await updateSubjectService(
    req.params.id,
    req.body,
    req.tenantId,
  );

  res.json(new ApiResponse(200, subject, "Subject updated"));
});

//  DELETE
export const deleteSubject = asyncHandler(async (req, res) => {
  await deleteSubjectService(req.params.id, req.tenantId);

  res.json(new ApiResponse(200, null, "Subject deleted"));
});

//  ADD STUDENT
export const addStudent = asyncHandler(async (req, res) => {
  const subject = await addStudentToSubjectService(
    req.params.id,
    req.body.studentId,
    req.tenantId,
  );

  res.json(new ApiResponse(200, subject, "Student added"));
});

//  REMOVE STUDENT
export const removeStudent = asyncHandler(async (req, res) => {
  const subject = await removeStudentFromSubjectService(
    req.params.id,
    req.body.studentId,
    req.tenantId,
  );

  res.json(new ApiResponse(200, subject, "Student removed"));
});
