import Book from "./book.model.js";
import Issue from "./issue.model.js";
import ApiError from "../../utils/ApiError.js";
import { createOrder } from "../../services/payment.service.js";

//  Get All Books
export const getBooks = async (query) => {
  const search = query.search || "";

  return await Book.find({
    isDeleted: false,
    title: { $regex: search, $options: "i" },
  });
};


//  Add Book
export const addBook = async (data) => {
  data.availableCopies = data.totalCopies;
  return await Book.create(data);
};


//  Issue Book
export const issueBook = async (studentId, bookId) => {
  const book = await Book.findById(bookId);

  if (!book || book.isDeleted) {
    throw new ApiError(404, "Book not found");
  }

  if (book.availableCopies <= 0) {
    throw new ApiError(400, "No copies available");
  }

  //  Prevent duplicate issue
  const alreadyIssued = await Issue.findOne({
    studentId,
    bookId,
    status: "ISSUED",
  });

  if (alreadyIssued) {
    throw new ApiError(400, "Book already issued");
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7); // 7 days

  const issue = await Issue.create({
    studentId,
    bookId,
    dueDate,
  });

  book.availableCopies -= 1;
  book.issuedCount += 1;

  await book.save();

  return issue;
};


//  Return Book
export const returnBook = async (studentId, bookId) => {
  const issue = await Issue.findOne({
    studentId,
    bookId,
    status: "ISSUED",
  });

  if (!issue) {
    throw new ApiError(404, "No active issue found");
  }

  const today = new Date();

  let fine = 0;

  // 💰 Late fine logic
  if (today > issue.dueDate) {
    const daysLate = Math.ceil(
      (today - issue.dueDate) / (1000 * 60 * 60 * 24)
    );
    fine = daysLate * 10; // ₹10/day
  }

  issue.returnDate = today;
  issue.status = "RETURNED";
  issue.fine = fine;

  await issue.save();

  const book = await Book.findById(bookId);
  book.availableCopies += 1;

  await book.save();

  return issue;
};

//pay fine
export const payFine = async (issueId) => {
  const issue = await Issue.findById(issueId);

  if (!issue || issue.fine <= 0) {
    throw new ApiError(400, "No fine");
  }

  return await createOrder(issue.fine);
};


//  VERIFY PAYMENT
export const verifyFine = async (issueId) => {
  const issue = await Issue.findById(issueId);

  issue.paymentStatus = "PAID";
  await issue.save();

  return issue;
};
