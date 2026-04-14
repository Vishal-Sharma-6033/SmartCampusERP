import express from "express";
import * as controller from "./exam.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();


router.post("/",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("CREATE", "EXAM"),controller.createExam);

router.get("/",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.getExams);

router.post("/register",auth,role(ROLES.STUDENT),auditMiddleware("REGISTER", "EXAM"),controller.register);

router.get("/results",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.results);

router.get("/hallticket",auth,role(ROLES.STUDENT, ROLES.ADMIN),controller.hallTicket);

router.post("/publish",auth,role(ROLES.ADMIN, ROLES.TEACHER),auditMiddleware("PUBLISH_RESULT", "EXAM"),controller.publishResult);

router.get("/hallticket/download",auth,role(ROLES.STUDENT, ROLES.ADMIN),auditMiddleware("DOWNLOAD_HALLTICKET", "EXAM"),controller.downloadHallTicket);

router.post("/seating/generate",auth,role(ROLES.ADMIN),auditMiddleware("GENERATE_SEATING", "EXAM"),controller.generateSeating);


export default router;