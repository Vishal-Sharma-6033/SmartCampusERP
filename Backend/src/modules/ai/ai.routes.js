import express from "express";
import {chatWithAI, getStudentPerformance, getRecommendations, getWeakSubjects, getPerformanceTrend ,getSmartResources} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();
import { auditMiddleware } from "../../middlewares/audit.middleware.js";


router.post("/chat",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("AI_CHAT", "AI"), chatWithAI);

router.get("/performance/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VIEW_PERFORMANCE", "AI"), getStudentPerformance);

router.get("/recommendations/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VIEW_RECOMMENDATION", "AI"), getRecommendations);
 
router.get("/weak-areas/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VIEW_WEAK_AREAS", "AI"), getWeakSubjects);

router.get("/trend/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VIEW_TREND", "AI"), getPerformanceTrend);

router.get("/resources/:studentId",auth,role(ROLES.ADMIN, ROLES.STUDENT),auditMiddleware("VIEW_RESOURCES", "AI"), getSmartResources);

export default router;