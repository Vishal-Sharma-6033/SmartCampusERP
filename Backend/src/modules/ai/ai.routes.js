import express from "express";
import {chatWithAI, getStudentPerformance, getRecommendations, getWeakSubjects, getPerformanceTrend ,getSmartResources} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

router.post("/chat", auth,role(ROLES.ADMIN,ROLES.STUDENT), chatWithAI);
router.get("/performance/:studentId", auth, getStudentPerformance);
router.get("/recommendations/:studentId", auth, getRecommendations);
router.get("/weak-areas/:studentId", auth, getWeakSubjects);
router.get("/trend/:studentId", auth, getPerformanceTrend);
router.get("/resources/:studentId", auth, getSmartResources);

export default router;