import express from "express";
import { register, login } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";
import { authLimiter } from "../../security/rateLimiter.js";

const router = express.Router();

router.post("/register",  validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);

export default router;