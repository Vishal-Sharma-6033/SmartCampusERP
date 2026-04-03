import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    type: {
      type: String,
      enum: ["internal", "final"],
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    className: { type: String, required: true },
    semester: { type: Number, required: true },

    date: { type: Date, required: true },

    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    duration: { type: Number, required: true },

    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);