import express from "express";
import {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  deleteAttendance,
  bulkMarkAttendance,
  markAllAbsent,
} from "./attendance.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", auth, markAttendance);
router.get("/student/:studentId", auth, getStudentAttendance);
router.get("/date", auth, getAttendanceByDate);
router.delete("/", auth, deleteAttendance);
router.post("/bulk", auth, bulkMarkAttendance);
router.post("/bulk-absent", auth, markAllAbsent);

export default router;