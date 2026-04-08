import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  getStudentDashboard,
  updateSubject,
  deleteSubject,
  addStudent,
  removeStudent,
} from "./academic.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// SUBJECT APIs
router.post("/subjects", roleMiddleware("ADMIN", "TEACHER"), createSubject);
router.get("/subjects", getSubjects);
router.get("/subjects/:id", getSubjectById);
router.get("/dashboard/:studentId", getStudentDashboard);
router.put("/subjects/:id", roleMiddleware("ADMIN", "TEACHER"), updateSubject);
router.delete("/subjects/:id", roleMiddleware("ADMIN"), deleteSubject);
router.post("/subjects/:id/add-student", roleMiddleware("ADMIN", "TEACHER"), addStudent);
router.post("/subjects/:id/remove-student", roleMiddleware("ADMIN", "TEACHER"), removeStudent);

export default router;