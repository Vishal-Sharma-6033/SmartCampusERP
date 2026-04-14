// import mongoose from "mongoose";

// const tenantSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["ACTIVE", "INACTIVE"],
//       default: "ACTIVE",
//     },
//     collegeCode: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Tenant", tenantSchema);