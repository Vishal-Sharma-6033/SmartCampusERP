import express from 'express';
import * as feeController from "./fees.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();


router.post("/create",auth,role(ROLES.ADMIN),auditMiddleware("CREATE", "FEES"),feeController.createFee);

router.post("/pay", auth, role(ROLES.ADMIN, ROLES.STUDENT), auditMiddleware("PAYMENT_INIT", "FEES"), feeController.payFees);

router.post("/verify", auth, role(ROLES.ADMIN, ROLES.STUDENT), auditMiddleware("PAYMENT_VERIFY", "FEES"), feeController.verifyPayment);

router.get("/receipt/:id", auth, role(ROLES.ADMIN, ROLES.STUDENT), feeController.getReceipt);

router.post("/late-fee/:studentId", auth, role(ROLES.ADMIN), auditMiddleware("APPLY_LATE_FEE", "FEES"), feeController.applyLateFee);

router.post("/installment", auth, role(ROLES.ADMIN, ROLES.STUDENT), auditMiddleware("CREATE_INSTALLMENT", "FEES"), feeController.createInstallments);

router.post("/installment/pay", auth, role(ROLES.ADMIN, ROLES.STUDENT), auditMiddleware("PAY_INSTALLMENT", "FEES"), feeController.payInstallment);

router.get("/analytics", auth, role(ROLES.ADMIN), feeController.getAnalytics);

router.get("/:studentId", auth, role(ROLES.ADMIN, ROLES.STUDENT), feeController.getFees);

router.post("/scholarship", auth, role(ROLES.ADMIN, ROLES.STUDENT), auditMiddleware("APPLY_SCHOLARSHIP", "FEES"), feeController.applyScholarship);


export default router;