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
import {auditMiddleware} from "../../middlewares/audit.middleware.js";
const router = express.Router();

router.use(auth);

router.post("/subjects",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("CREATE", "SUBJECT"), createSubject);

router.get("/subjects",auth,role(ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER),getSubjects);

router.get("/subjects/:id",auth,role(ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER),getSubjectById);

router.get("/dashboard/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT),getStudentDashboard);

router.put("/subjects/:id",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("UPDATE", "SUBJECT"), updateSubject);

router.delete("/subjects/:id",auth,role(ROLES.ADMIN),auditMiddleware("DELETE", "SUBJECT"), deleteSubject);

router.post("/subjects/:id/add-student", auth, role(ROLES.ADMIN, ROLES.TEACHER), auditMiddleware("ADD_STUDENT", "SUBJECT"), addStudent);

router.post("/subjects/:id/remove-student", auth, role(ROLES.ADMIN, ROLES.TEACHER), auditMiddleware("REMOVE_STUDENT", "SUBJECT"), removeStudent);

export default router;