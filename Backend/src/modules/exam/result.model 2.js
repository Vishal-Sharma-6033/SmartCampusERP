import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    subjects: [
      {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
        marks: Number,
      },
    ],

    total: Number,
    percentage: Number,
    grade: String,

    status: {
      type: String,
      enum: ["pass", "fail"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);