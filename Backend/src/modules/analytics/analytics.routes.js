import express from "express";
import { getDashboard } from "./analytics.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
const router = express.Router();

router.get("/dashboard", auth, role(ROLES.ADMIN, ROLES.STUDENT), getDashboard);

export default router;