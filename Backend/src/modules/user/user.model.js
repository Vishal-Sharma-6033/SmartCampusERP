import mongoose from "mongoose";

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
      enum: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
      default: "STUDENT",
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
    bookmarks:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Content"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);