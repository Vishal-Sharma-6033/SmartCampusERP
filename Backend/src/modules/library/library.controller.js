import * as libraryService from "./library.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { ROLES } from "../../config/constants.js";

// GET BOOKS
export const getBooks = asyncHandler(async (req, res) => {
  const books = await libraryService.getBooks(req.query);
  res.json(new ApiResponse(200, books));
});

// GET MY ISSUES
export const getMyIssues = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;
  const issues = await libraryService.getMyIssues(studentId);
  res.json(new ApiResponse(200, issues));
});

// GET ALL ISSUES (Admin/Teacher)
export const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await libraryService.getAllIssues(req.query);
  res.json(new ApiResponse(200, issues));
});

// ADD BOOK
export const addBook = asyncHandler(async (req, res) => {
  const book = await libraryService.addBook(req.body);
  res.json(new ApiResponse(201, book));
});

// ISSUE BOOK
export const issueBook = asyncHandler(async (req, res) => {
  let { studentId, bookId } = req.body;
  if (req.user.role === ROLES.STUDENT) {
    studentId = req.user._id || req.user.id;
  }
  const issue = await libraryService.issueBook(studentId, bookId);
  res.json(new ApiResponse(200, issue));
});

// RETURN BOOK
export const returnBook = asyncHandler(async (req, res) => {
  let { studentId, bookId } = req.body;
  if (req.user.role === ROLES.STUDENT) {
    studentId = req.user._id || req.user.id;
  }
  const result = await libraryService.returnBook(studentId, bookId);
  res.json(new ApiResponse(200, result));
});

// PAY FINE
export const payFine = asyncHandler(async (req, res) => {
  const { issueId } = req.body;
  const data = await libraryService.payFine(issueId);
  res.json(new ApiResponse(200, data));
});

// VERIFY
export const verifyFine = asyncHandler(async (req, res) => {
  const { issueId, paymentId, orderId, razorpaySignature } = req.body;
  const data = await libraryService.verifyFine({
    issueId,
    paymentId,
    orderId,
    razorpaySignature
  });
  res.json(new ApiResponse(200, data));
});

// UPDATE BOOK
export const updateBook = asyncHandler(async (req, res) => {
  const book = await libraryService.updateBook(req.params.id, req.body);
  res.json(new ApiResponse(200, book));
});

// DELETE BOOK
export const deleteBook = asyncHandler(async (req, res) => {
  await libraryService.deleteBook(req.params.id);
  res.json(new ApiResponse(200, { message: "Book deleted successfully" }));
});