import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    returnDate: Date,

    fine: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["ISSUED", "RETURNED"],
      default: "ISSUED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);