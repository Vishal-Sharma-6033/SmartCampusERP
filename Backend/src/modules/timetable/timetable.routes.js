import express from 'express';
import * as controller from "./timetable.controller.js";
import auth from "../../middlewares/auth.middleware.js";


const router = express.Router();


router.post("/", auth, controller.createTimetable);
router.get("/", auth, controller.getWeeklyTimetable);



export default router;