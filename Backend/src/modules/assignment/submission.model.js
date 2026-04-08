import mongoose, { mongo } from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileUrl: {
      type: String,
    },
    text: String,
    marks: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "late"],
      default: "pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    latePenalty: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Submission", submissionSchema);