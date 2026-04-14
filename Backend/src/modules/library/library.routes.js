import express from "express";
import * as controller from "./library.controller.js";
import role from "../../middlewares/role.middleware.js";
import auth from "../../middlewares/auth.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();


router.get("/books",auth,role(ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER),controller.getBooks);

router.post("/books",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("CREATE", "LIBRARY"),controller.addBook);

router.post("/issue",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("ISSUE_BOOK", "LIBRARY"),controller.issueBook);

router.post("/return",auth,role(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT),auditMiddleware("RETURN_BOOK", "LIBRARY"),controller.returnBook);

router.post("/pay-fine",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("PAY_FINE", "LIBRARY"),controller.payFine);

router.post("/verify-fine",auth,role(ROLES.ADMIN),auditMiddleware("VERIFY_FINE", "LIBRARY"),controller.verifyFine);

export default router;