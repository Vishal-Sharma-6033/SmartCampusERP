import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: ["assignment", "reminder", "grade", "general", "EXAM","FEES"],
      default: "general",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);