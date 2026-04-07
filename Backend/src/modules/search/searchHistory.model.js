import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// latest first
searchHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("SearchHistory", searchHistorySchema);