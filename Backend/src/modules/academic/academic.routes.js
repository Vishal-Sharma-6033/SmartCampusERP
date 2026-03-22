import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  getStudentDashboard,
} from "./academic.controller.js";

import {
  updateSubject,
  deleteSubject,
  addStudent,
  removeStudent,
} from "./academic.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import tenantMiddleware from "../../middlewares/tenant.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(tenantMiddleware);

router.post("/subjects", roleMiddleware("ADMIN", "TEACHER"), createSubject);
router.get("/subjects", getSubjects);
router.get("/subjects/:id", getSubjectById);
router.get("/dashboard/:studentId", getStudentDashboard);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);
router.post("/subjects/:id/add-student", addStudent);
router.post("/subjects/:id/remove-student", removeStudent);


export default router;
