import express from 'express';
import * as controller from "./timetable.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";


const router = express.Router();


router.post("/", auth, role("ADMIN", "TEACHER"), controller.createTimetable);
router.get("/", auth, controller.getWeeklyTimetable);
router.get("/current", auth, controller.getCurrentTimetable);
router.get("/date", auth, controller.getTimetableByDate);
router.post("/generate", controller.generateTimetable);

export default router;