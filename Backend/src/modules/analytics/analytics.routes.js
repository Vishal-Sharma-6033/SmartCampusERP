import express from "express";
import { getDashboard } from "./analytics.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", auth, getDashboard);

export default router;