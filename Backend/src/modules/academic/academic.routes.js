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
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
const router = express.Router();

router.use(auth);

// SUBJECT APIs
router.post("/subjects", auth, role(ROLES.ADMIN, ROLES.TEACHER), createSubject);
router.get("/subjects", auth, role(ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER), getSubjects);
router.get("/subjects/:id", auth, role(ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER),getSubjectById);
router.get("/dashboard/:studentId",auth, role(ROLES.ADMIN, ROLES.STUDENT), getStudentDashboard);
router.put("/subjects/:id", auth, role(ROLES.ADMIN, ROLES.TEACHER), updateSubject);
router.delete("/subjects/:id", auth, role(ROLES.ADMIN), deleteSubject);
router.post("/subjects/:id/add-student", auth, role(ROLES.ADMIN, ROLES.TEACHER), addStudent);
router.post("/subjects/:id/remove-student", auth, role(ROLES.ADMIN, ROLES.TEACHER), removeStudent);

export default router;