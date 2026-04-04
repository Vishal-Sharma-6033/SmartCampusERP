import Fee from './fees.model.js';
import { createOrder } from '../../services/payment.service.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import {v4 as uuid} from 'uuid';

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


export const getFeeByStudent = async(studentId)=>{
    return await Fee.findOne({studentId})
}

export const payFees = async(studentId, amount)=>{
    const fee = await Fee.findOne({studentId});
    if(!fee){
        throw new Error("Fee record not found for the student");
    }
    const order = await createOrder(amount);
    return{
        order,
        fee,
    }
}

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

    // ✅ WAIT HERE
    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};