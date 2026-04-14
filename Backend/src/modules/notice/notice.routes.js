import express from "express";
import * as controller from "./notice.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();


router.post("/",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("CREATE", "NOTICE"),controller.createNotice);

router.get("/",auth,role(ROLES.TEACHER, ROLES.ADMIN, ROLES.STUDENT),controller.getNotices);

router.get("/events",auth,role(ROLES.TEACHER, ROLES.ADMIN, ROLES.STUDENT),controller.getEvents);

export default router;