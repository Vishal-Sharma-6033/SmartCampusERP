import express from "express";
import { getDashboard } from "./analytics.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";
const router = express.Router();

router.get("/dashboard",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VIEW_DASHBOARD", "ADMIN"), getDashboard);

export default router;