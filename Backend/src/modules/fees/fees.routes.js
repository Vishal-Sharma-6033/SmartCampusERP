import express from 'express';
import * as feeController from "./fees.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();


router.post("/create",auth, role("ADMIN"), feeController.createFee);
router.post("/pay", auth,  role("ADMIN", "STUDENT"),  feeController.payFees);
router.post("/verify", auth,  role("ADMIN", "STUDENT"),  feeController.verifyPayment);
router.get("/receipt/:id", auth,  role("ADMIN", "STUDENT"),  feeController.getReceipt);
router.get("/:studentId", auth,  role("ADMIN", "STUDENT"),  feeController.getFees);
router.post("/late-fee/:studentId", auth, role("ADMIN", "STUDENT"), feeController.applyLateFee);
router.post("/installment", auth, role("ADMIN", "STUDENT"), feeController.createInstallments);
router.post("/installment/pay", auth, role("ADMIN", "STUDENT"), feeController.payInstallment);
router.get("/analytics", auth, role("ADMIN"), feeController.getAnalytics);

export default router;