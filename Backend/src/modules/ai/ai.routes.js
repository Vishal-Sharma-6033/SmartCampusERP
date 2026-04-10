import express from "express";
import {chatWithAI, getStudentPerformance, getRecommendations} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", auth, chatWithAI);
router.get("/performance/:studentId", auth, getStudentPerformance);
router.get("/recommendations/:studentId", auth, getRecommendations);
export default router;