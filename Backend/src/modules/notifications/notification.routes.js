import express from "express";
import * as controller from "./notification.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";    
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";
const router = express.Router();


router.get("/",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.getMyNotifications);

router.post("/",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("CREATE_NOTIFICATION", "NOTIFICATION"),controller.createNotification);

router.patch("/:id/read",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("MARK_READ", "NOTIFICATION"),controller.markAsRead);

export default router;