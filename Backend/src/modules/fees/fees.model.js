import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID"],
      default: "PENDING",
    },
    payments: [
      {
        amount: Number,
        paymentId: String,
        orderId: String,
        method: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lateFee: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: Date,
    },
    installments: [
      {
        amount: Number,
        dueDate: Date,
        status: {
          type: String,
          enum: ["PENDING", "PAID"],
          default: "PENDING",
        },
      },
    ],
  },

  { timestamps: true },
);

export default mongoose.model("Fee", feeSchema);
