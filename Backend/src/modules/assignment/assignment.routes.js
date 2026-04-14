import express from "express";
import * as controller from "./assignment.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";
const router = express.Router();


router.post("/",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("CREATE", "ASSIGNMENT"), controller.createAssignment);

router.post("/:id/submit",auth,role(ROLES.STUDENT, ROLES.ADMIN),auditMiddleware("SUBMIT", "ASSIGNMENT"), controller.submitAssignment);

router.get("/student/:id",auth,role(ROLES.STUDENT, ROLES.ADMIN, ROLES.TEACHER), controller.getStudentAssignments);

router.patch("/:submissionId/grade",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("GRADE", "ASSIGNMENT"), controller.gradeSubmission);

router.get("/:id/plagiarism",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("PLAGIARISM_CHECK", "ASSIGNMENT"), controller.plagiarismCheck);

router.get("/:id/analytics",auth,role(ROLES.TEACHER, ROLES.ADMIN), controller.analytics);

router.get("/subject/:subjectId",auth,role(ROLES.TEACHER, ROLES.ADMIN), controller.subjectFeed);

export default router;