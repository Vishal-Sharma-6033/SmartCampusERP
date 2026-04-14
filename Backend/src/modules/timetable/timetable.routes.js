import express from 'express';
import * as controller from "./timetable.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();



router.post("/",auth,role(ROLES.ADMIN),auditMiddleware("CREATE", "TIMETABLE"), controller.createTimetable);

router.get("/",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),  controller.getWeeklyTimetable);

router.get("/current",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),  controller.getCurrentTimetable);

router.get("/date",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),  controller.getTimetableByDate);

router.post("/generate",auth,role(ROLES.ADMIN),auditMiddleware("GENERATE", "TIMETABLE"), controller.generateTimetable);

export default router;