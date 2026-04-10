import express from "express";
import {chatWithAI, getStudentPerformance, getRecommendations, getWeakSubjects} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", auth, chatWithAI);
router.get("/performance/:studentId", auth, getStudentPerformance);
router.get("/recommendations/:studentId", auth, getRecommendations);
router.get("/weak-areas/:studentId", auth, getWeakSubjects);

export default router;