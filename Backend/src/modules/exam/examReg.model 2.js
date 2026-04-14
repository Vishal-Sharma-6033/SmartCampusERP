import mongoose from "mongoose";

const examRegistrationSchema = new mongoose.Schema(
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

    roomNumber: Number,
    seatNumber: Number,

    status: {
      type: String,
      enum: ["registered"],
      default: "registered",
    },
  },
  { timestamps: true }
);

// 🔥 prevent duplicate registration
examRegistrationSchema.index({ student: 1, exam: 1 }, { unique: true });

export default mongoose.model(
  "ExamRegistration",
  examRegistrationSchema
);