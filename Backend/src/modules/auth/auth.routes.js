import express from "express";
import { register, login } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";
import { authLimiter } from "../../security/rateLimiter.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";
const router = express.Router();


router.post("/register",validate(registerSchema),auditMiddleware("REGISTER", "AUTH"), register);

router.post("/login",authLimiter,validate(loginSchema),auditMiddleware("LOGIN_ATTEMPT", "AUTH"), login);

export default router;