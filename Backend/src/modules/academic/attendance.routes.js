import express from "express";
import {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  deleteAttendance,
  bulkMarkAttendance,
  markAllAbsent,
  deleteBulkAttendance
} from "./attendance.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
const router = express.Router();

import { auditMiddleware } from "../../middlewares/audit.middleware.js";


router.post("/",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("CREATE", "ATTENDANCE"), markAttendance);

router.get("/student/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT), getStudentAttendance);

router.get("/date",auth,role(ROLES.ADMIN, ROLES.TEACHER), getAttendanceByDate);

router.delete("/",auth,role(ROLES.ADMIN),auditMiddleware("DELETE", "ATTENDANCE"), deleteAttendance);

router.post("/bulk",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("BULK_CREATE", "ATTENDANCE"), bulkMarkAttendance);

router.post("/bulk-absent",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("BULK_ABSENT", "ATTENDANCE"), markAllAbsent);

router.delete("/bulk",auth,role(ROLES.ADMIN),auditMiddleware("BULK_DELETE", "ATTENDANCE"), deleteBulkAttendance);

export default router;