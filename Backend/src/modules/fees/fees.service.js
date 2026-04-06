import Fee from "./fees.model.js";
import { createOrder } from "../../services/payment.service.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { v4 as uuid } from "uuid";
import { createNotification } from "../notifications/notification.service.js";

export const createFee = async (data) => {
  const existing = await Fee.findOne({ studentId: data.studentId });

  if (existing) {
    throw new Error("Fee already exists for this student");
  }

  const fee = await Fee.create({
    studentId: data.studentId,
    totalAmount: data.totalAmount,
    paidAmount: 0,
    dueAmount: data.totalAmount,
    status: "PENDING",
  });

  return fee;
};

export const getFeeByStudent = async (studentId) => {
  return await Fee.findOne({ studentId });
};

export const payFees = async (studentId, amount) => {
  const fee = await Fee.findOne({ studentId });
  if (!fee) {
    throw new Error("Fee record not found for the student");
  }
  const order = await createOrder(amount);
  await createNotification({
  userId: studentId,
  title: "Receipt Generated",
  message: "Your payment receipt is ready for download",
  type: "FEES"
});
  return {
    order,
    fee,
  };
};

export const verifyAndUpdatePayment = async (data) => {
  const { studentId, amount, paymentId, orderId } = data;

  const fee = await Fee.findOne({ studentId });

  fee.paidAmount += amount;
  fee.dueAmount = fee.totalAmount - fee.paidAmount;

  if (fee.dueAmount <= 0) fee.status = "PAID";
  else fee.status = "PARTIAL";

  fee.payments.push({
    amount,
    paymentId,
    orderId,
    method: "ONLINE",
  });

  await fee.save();
  await createNotification({
    userId: studentId,
    title: "Payment Successful",
    message: `₹${amount} received. Remaining due: ₹${fee.dueAmount}`,
    type: "FEES",
  });

  return fee;
};

export const generateReceipt = async (feeId) => {
  const fee = await Fee.findById(feeId);

  const fileName = `receipt-${uuid()}.pdf`;
  const dir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, fileName);

  const doc = new PDFDocument();

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(20).text("Fee Receipt", { align: "center" });
    doc.moveDown();

    doc.text(`Student ID: ${fee.studentId}`);
    doc.text(`Total Amount: ${fee.totalAmount}`);
    doc.text(`Paid Amount: ${fee.paidAmount}`);
    doc.text(`Due Amount: ${fee.dueAmount}`);
    doc.text(`Status: ${fee.status}`);

    doc.moveDown();
    doc.text("Payments:");

    fee.payments.forEach((p) => {
      doc.text(`- ${p.amount} | ${p.paymentId}`);
    });

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

// export const generateReceipt = async (feeId) => {

//   const fee = await Fee.findById(feeId);

//   const doc = new PDFDocument();
//   const buffers = [];

//   doc.on("data", (chunk) => buffers.push(chunk));

//   return new Promise((resolve, reject) => {
//     doc.on("end", async () => {
//       const pdfBuffer = Buffer.concat(buffers);

//       try {
//         const result = await storageService.uploadBuffer(pdfBuffer);

//         resolve({
//           url: result.secure_url,
//           public_id: result.public_id,
//         });
//       } catch (err) {
//         reject(err);
//       }
//     });

//     // 📄 PDF CONTENT
//     doc.fontSize(20).text("Fee Receipt", { align: "center" });
//     doc.moveDown();

//     doc.text(`Student ID: ${fee.studentId}`);
//     doc.text(`Total Amount: ${fee.totalAmount}`);
//     doc.text(`Paid Amount: ${fee.paidAmount}`);
//     doc.text(`Due Amount: ${fee.dueAmount}`);
//     doc.text(`Status: ${fee.status}`);

//     doc.moveDown();
//     doc.text("Payments:");

//     fee.payments.forEach((p) => {
//       doc.text(`- ${p.amount} | ${p.paymentId}`);
//     });

//     doc.end();
//   });
// };

export const applyLateFee = async (studentId) => {
  const fee = await Fee.findOne({ studentId });
  const today = new Date();

  if (fee.dueDate && today > fee.dueDate && fee.dueAmount > 0) {
    const daysLate = Math.ceil((today - fee.dueDate) / (1000 * 60 * 60 * 24));

    const penalty = daysLate * 50;

    fee.lateFee = penalty;
    fee.dueAmount = fee.totalAmount - fee.paidAmount + penalty;

    await fee.save();

    await createNotification({
      userId: studentId,
      title: "Late Fee Applied",
      message: `A late fee of ₹${penalty} has been added`,
      type: "FEES",
    });
  }
  return fee;
};

export const payInstallment = async (studentId, installmentIndex) => {
  const fee = await Fee.findOne({ studentId });

  if (!fee) throw new Error("Fee record not found");

  if (!fee.installments || fee.installments.length === 0) {
    throw new Error("No installments found");
  }

  if (installmentIndex < 0 || installmentIndex >= fee.installments.length) {
    throw new Error("Invalid installment index");
  }

  const inst = fee.installments[installmentIndex];

  if (inst.status === "PAID") {
    throw new Error("Installment already paid");
  }

  inst.status = "PAID";

  fee.paidAmount += inst.amount;
  fee.dueAmount = fee.totalAmount - fee.paidAmount;

  if (fee.dueAmount <= 0) fee.status = "PAID";
  else fee.status = "PARTIAL";

  await fee.save();
  await createNotification({
  userId: studentId,
  title: "Installment Paid",
  message: `You paid installment of ₹${inst.amount}`,
  type: "FEES"
});

  return fee;
};

export const createInstallments = async (studentId, installments) => {
  const fee = await Fee.findOne({ studentId });

  if (!fee) throw new Error("Fee record not found");

  fee.installments = installments;

  await fee.save();

  return fee;
};

export const getFeeAnalytics = async () => {
  const totalCollection = await Fee.aggregate([
    {
      $group: {
        _id: null,
        totalPaid: { $sum: "$paidAmount" },
        totalDue: { $sum: "$dueAmount" },
      },
    },
  ]);

  const statusStats = await Fee.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalCollection: totalCollection[0],
    statusStats,
  };
};

export const applyScholarship = async (studentId, scholarship) => {
  const fee = await Fee.findOne({ studentId });

  if (!fee) throw new Error("Fee not found");

  let discount = 0;

  if (scholarship.type === "PERCENTAGE") {
    discount = (fee.totalAmount * scholarship.value) / 100;
  } else {
    discount = scholarship.value;
  }

  fee.scholarship = scholarship;
  fee.discountAmount = discount;
  fee.finalAmount = fee.totalAmount - discount;

  fee.dueAmount = fee.finalAmount - fee.paidAmount;

  await fee.save();
  await createNotification({
  userId: studentId,
  title: "Scholarship Applied",
  message: `₹${discount} discount applied to your fees`,
  type: "FEES"
});

  return fee;
};
