import express from "express";
import {
  chatWithAI,
  getStudentPerformance,
  getRecommendations,
  getWeakSubjects,
  getPerformanceTrend,
  getSmartResources,
} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";
import ApiError from "../../utils/ApiError.js";

const router = express.Router();

/**
 * Ownership guard for /:studentId routes.
 * - ADMIN: can access any student's data
 * - STUDENT: can only access their own data (req.user.id must equal req.params.studentId)
 */
const requireOwnerOrAdmin = (req, res, next) => {
  const { role: userRole, id: userId } = req.user;

  if (userRole === ROLES.ADMIN) {
    return next(); // admins can see anyone
  }

  if (userId !== req.params.studentId) {
    return next(new ApiError(403, "Access denied: you can only view your own data"));
  }

  next();
};

// Chat — no studentId param, no ownership check needed
router.post(
  "/chat",
  auth,
  role(ROLES.ADMIN, ROLES.STUDENT),
  auditMiddleware("AI_CHAT", "AI"),
  chatWithAI
);

// All /:studentId routes require ownership check
router.get(
  "/performance/:studentId",
  auth,
  role(ROLES.ADMIN, ROLES.STUDENT),
  requireOwnerOrAdmin,
  auditMiddleware("VIEW_PERFORMANCE", "AI"),
  getStudentPerformance
);

router.get(
  "/recommendations/:studentId",
  auth,
  role(ROLES.ADMIN, ROLES.STUDENT),
  requireOwnerOrAdmin,
  auditMiddleware("VIEW_RECOMMENDATION", "AI"),
  getRecommendations
);

router.get(
  "/weak-areas/:studentId",
  auth,
  role(ROLES.ADMIN, ROLES.STUDENT),
  requireOwnerOrAdmin,
  auditMiddleware("VIEW_WEAK_AREAS", "AI"),
  getWeakSubjects
);

router.get(
  "/trend/:studentId",
  auth,
  role(ROLES.ADMIN, ROLES.STUDENT),
  requireOwnerOrAdmin,
  auditMiddleware("VIEW_TREND", "AI"),
  getPerformanceTrend
);

router.get(
  "/resources/:studentId",
  auth,
  role(ROLES.ADMIN, ROLES.STUDENT),
  requireOwnerOrAdmin,
  auditMiddleware("VIEW_RESOURCES", "AI"),
  getSmartResources
);

export default router;