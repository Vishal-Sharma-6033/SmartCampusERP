import mongoose from "mongoose";
import { ROLES } from "../../config/constants.js";
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.STUDENT,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    studentProfile: {
      rollNumber: String,
      class: String,
      section: String,
    },

    teacherProfile: {
      subject: String,
      experience: Number,
    },

    parentProfile: {
      children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
