import * as feeService from "./fees.service.js";


export const createFee = async (req, res) => {
  try {
    const fee = await feeService.createFee(req.body);

    res.status(201).json({
      success: true,
      data: fee,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const getFees = async (req, res) => {
  const data = await feeService.getFeeByStudent(req.params.studentId);
  res.json(data);
};

export const payFees = async (req, res) => {
  const { studentId, amount } = req.body;

  const data = await feeService.payFees(studentId, amount);

  res.json(data);
};

export const verifyPayment = async (req, res) => {
  const data = await feeService.verifyAndUpdatePayment(req.body);
  res.json(data);
};

export const getReceipt = async (req, res) => {
  const file = await feeService.generateReceipt(req.params.id);
  res.download(file);
};
// export const getReceipt = async (req, res) => {
//   const data = await feeService.generateReceipt(req.params.id);

//   res.json({
//     success: true,
//     receiptUrl: data.url,
//   });
// };

export const applyLateFee = async (req, res) => {
  const data = await feeService.applyLateFee(req.params.studentId);
  res.json(data);
};