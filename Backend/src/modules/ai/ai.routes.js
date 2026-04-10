import express from "express";
import {chatWithAI, getStudentPerformance} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", auth, chatWithAI);
router.get("/performance/:studentId", auth, getStudentPerformance);

export default router;