import express from "express";
import * as controller from "./library.controller.js";
import role from "../../middlewares/role.middleware.js";
import auth from "../../middlewares/auth.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();


router.get("/books",auth,role(ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER),controller.getBooks);

router.get("/my-issues", auth, role(ROLES.STUDENT, ROLES.ADMIN, ROLES.TEACHER), controller.getMyIssues);

router.get("/issues", auth, role(ROLES.ADMIN, ROLES.TEACHER), controller.getAllIssues);

router.post("/books",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("CREATE", "LIBRARY"),controller.addBook);

router.post("/issue",auth,role(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT),auditMiddleware("ISSUE_BOOK", "LIBRARY"),controller.issueBook);

router.post("/return",auth,role(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT),auditMiddleware("RETURN_BOOK", "LIBRARY"),controller.returnBook);

// Fine Payments
router.post("/pay-fine",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("PAY_FINE", "LIBRARY"),controller.payFine);
router.post("/verify-fine",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VERIFY_FINE", "LIBRARY"),controller.verifyFine);

router.post("/fine/pay",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("PAY_FINE", "LIBRARY"),controller.payFine);
router.post("/fine/verify",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VERIFY_FINE", "LIBRARY"),controller.verifyFine);

router.put("/books/:id", auth, role(ROLES.ADMIN, ROLES.TEACHER), auditMiddleware("UPDATE_BOOK", "LIBRARY"), controller.updateBook);
router.delete("/books/:id", auth, role(ROLES.ADMIN, ROLES.TEACHER), auditMiddleware("DELETE_BOOK", "LIBRARY"), controller.deleteBook);

export default router;