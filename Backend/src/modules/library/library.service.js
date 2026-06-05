import crypto from "crypto";
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

// Get My Issues (Student)
export const getMyIssues = async (studentId) => {
  return await Issue.find({ studentId })
    .populate("bookId", "title author category")
    .sort({ createdAt: -1 });
};

// Get All Issues (Admin/Teacher)
export const getAllIssues = async (query = {}) => {
  const filter = {};
  
  if (query.status && query.status !== "All") {
    // Check if filtering by OVERDUE (which is ISSUED and past due date)
    if (query.status === "OVERDUE") {
      filter.status = "ISSUED";
      filter.dueDate = { $lt: new Date() };
    } else {
      filter.status = query.status;
    }
  }
  
  if (query.studentId) {
    filter.studentId = query.studentId;
  }

  return await Issue.find(filter)
    .populate("studentId", "name email")
    .populate("bookId", "title author category")
    .sort({ createdAt: -1 });
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
  if (fine > 0) {
    issue.paymentStatus = "PENDING";
  }

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
export const verifyFine = async (data) => {
  const { issueId, paymentId, orderId, razorpaySignature } = data;

  if (!razorpaySignature) {
    throw new ApiError(400, "Payment signature is required");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, "Payment verification failed: invalid signature");
  }

  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new ApiError(404, "Issue record not found");
  }

  issue.paymentStatus = "PAID";
  await issue.save();

  return issue;
};

// Update Book
export const updateBook = async (id, data) => {
  // Ensure we don't accidentally clear total/available copies in bad edits
  const originalBook = await Book.findById(id);
  if (!originalBook) throw new ApiError(404, "Book not found");
  
  // Recalculate available copies if totalCopies changes
  if (data.totalCopies !== undefined) {
    const diff = data.totalCopies - originalBook.totalCopies;
    data.availableCopies = Math.max(0, originalBook.availableCopies + diff);
  }

  const book = await Book.findByIdAndUpdate(id, data, { new: true });
  return book;
};

// Delete Book (Soft Delete)
export const deleteBook = async (id) => {
  const book = await Book.findById(id);
  if (!book) throw new ApiError(404, "Book not found");
  book.isDeleted = true;
  await book.save();
  return book;
};
