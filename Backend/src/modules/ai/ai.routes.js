import express from "express";
import * as aiController from "./ai.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", authMiddleware, aiController.chat);


export default router;