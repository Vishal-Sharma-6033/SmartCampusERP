import * as libraryService from "./library.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";


// GET BOOKS
export const getBooks = asyncHandler(async (req, res) => {
  const books = await libraryService.getBooks(req.query);
  res.json(new ApiResponse(200, books));
});


// ADD BOOK
export const addBook = asyncHandler(async (req, res) => {
  const book = await libraryService.addBook(req.body);
  res.json(new ApiResponse(201, book));
});


// ISSUE BOOK
export const issueBook = asyncHandler(async (req, res) => {
  const { studentId, bookId } = req.body;

  const issue = await libraryService.issueBook(studentId, bookId);

  res.json(new ApiResponse(200, issue));
});


// RETURN BOOK
export const returnBook = asyncHandler(async (req, res) => {
  const { studentId, bookId } = req.body;

  const result = await libraryService.returnBook(studentId, bookId);
  
  res.json(new ApiResponse(200, result));
});

//  PAY FINE
export const payFine = asyncHandler(async (req, res) => {
  const { issueId } = req.body;
  const data = await libraryService.payFine(issueId);
  res.json(new ApiResponse(200, data));
});


// VERIFY
export const verifyFine = asyncHandler(async (req, res) => {
  const { issueId } = req.body;
  const data = await libraryService.verifyFine(issueId);
  res.json(new ApiResponse(200, data));
});