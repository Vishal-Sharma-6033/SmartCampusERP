import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["notice", "event"],
      default: "notice",
    },
    audience: {
      type: String,
      enum: ["all", "students", "teachers"],
      default: "all",
    },
    eventDate: {
      type: Date, // only for events
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
noticeSchema.index({ title: 'text', content: 'text' });
export default mongoose.model("Notice", noticeSchema);