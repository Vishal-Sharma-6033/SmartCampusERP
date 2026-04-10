import express from "express";
import {
  markAttendance,
  getStudentAttendance,
  getAttendanceByDate,
} from "./attendance.controller.js";

import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", auth, markAttendance);
router.get("/student/:studentId", auth, getStudentAttendance);
router.get("/date", auth, getAttendanceByDate);

export default router;