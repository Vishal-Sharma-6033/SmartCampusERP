import * as examService from "./exam.service.js";
import { generateHallTicketPDF } from "../../utils/hallTicketPdf.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";

// POST /api/exams
export const createExam = asyncHandler(async (req, res) => {
  const exam = await examService.createExam(req.body);

  res.status(201).json(
    new ApiResponse(201, exam, "Exam created successfully")
  );
});
// GET /api/exams
// export const getExams = asyncHandler(async (req, res) => {
//   const exams = await examService.getAllExams();
//   res.json(new ApiResponse(200, exams));
// });
export const getExams = asyncHandler(async (req, res) => {
  const exams = await examService.getAllExams(req.query);
  res.json(new ApiResponse(200, exams));
});

// POST /api/exams/register
export const register = asyncHandler(async (req, res) => {
  const { examId } = req.body;
  const studentId = req.user.id;

  const data = await examService.registerExam(examId, studentId);

  res.json(new ApiResponse(200, data));
});

// GET /api/exams/results
export const results = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const data = await examService.getResults(studentId);

  res.json(new ApiResponse(200, data));
});

// GET /api/exams/hallticket
export const hallTicket = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const data = await examService.getHallTicket(studentId);

  res.json(new ApiResponse(200, data));
});

// ADMIN: publish result
export const publishResult = asyncHandler(async (req, res) => {
  const result = await examService.publishResult(req.body);

  res.json(new ApiResponse(201, result, "Result published"));
});

export const downloadHallTicket = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const data = await examService.getHallTicket(studentId);

  generateHallTicketPDF(data, res);
});

export const generateSeating = asyncHandler(async (req, res) => {
  const { examId, rooms, seatsPerRoom } = req.body;

  const data = await examService.generateSeating(examId, {
    rooms,
    seatsPerRoom,
  });

  res.status(200).json(
    new ApiResponse(200, data, "Seating generated successfully")
  );
});