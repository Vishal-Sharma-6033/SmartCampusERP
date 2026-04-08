import express from "express";
import * as controller from "./assignment.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

// Teacher
router.post("/", auth, role("TEACHER","ADMIN"), controller.createAssignment);
// Student
router.post("/:id/submit", auth, role("STUDENT","ADMIN"), controller.submitAssignment);
router.get("/student/:id",auth,role("STUDENT","ADMIN"),controller.getStudentAssignments);

router.patch("/:submissionId/grade", auth, role("TEACHER","ADMIN"), controller.gradeSubmission);
router.get("/:id/plagiarism", auth, role("TEACHER","ADMIN"), controller.plagiarismCheck);
router.get("/:id/analytics", auth, role("TEACHER","ADMIN"), controller.analytics);
router.get("/subject/:subjectId", auth, controller.subjectFeed);
export default router;