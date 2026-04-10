import express from "express";
import { getDashboard } from "./analytics.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboard);

export default router;