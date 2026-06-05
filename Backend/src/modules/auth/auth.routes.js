import express from "express";
import { register, login, refresh, logout } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";
import { authLimiter } from "../../security/rateLimiter.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), auditMiddleware("REGISTER", "AUTH"), register);

router.post("/login", authLimiter, validate(loginSchema), auditMiddleware("LOGIN_ATTEMPT", "AUTH"), login);

// POST /api/v1/auth/refresh
// Client calls this when access token expires. Reads refreshToken cookie,
// returns new access token and rotates the refresh token cookie.
router.post("/refresh", authLimiter, auditMiddleware("TOKEN_REFRESH", "AUTH"), refresh);

// POST /api/v1/auth/logout
// Clears the refresh token cookie on the server side.
router.post("/logout", auditMiddleware("LOGOUT", "AUTH"), logout);

export default router;