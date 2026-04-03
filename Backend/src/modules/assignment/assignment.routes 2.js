import express from "express";
import * as controller from "./assignment.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

// Teacher
router.post("/", auth, role("TEACHER"), controller.createAssignment);
// Student
router.post("/:id/submit", auth, role("STUDENT"), controller.submitAssignment);
router.get("/student/:id",auth,role("STUDENT"),controller.getStudentAssignments);

router.patch("/:submissionId/grade", auth, role("TEACHER"), controller.gradeSubmission);
router.get("/:id/plagiarism", auth, role("TEACHER"), controller.plagiarismCheck);
router.get("/:id/analytics", auth, role("TEACHER"), controller.analytics);
router.get("/subject/:subjectId", auth, controller.subjectFeed);
export default router;