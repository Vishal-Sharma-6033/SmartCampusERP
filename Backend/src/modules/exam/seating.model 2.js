import mongoose from "mongoose";

const seatingSchema = new mongoose.Schema(
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
    roomNumber: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
    block: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Seating", seatingSchema);