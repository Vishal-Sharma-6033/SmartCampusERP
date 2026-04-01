import express from "express";
import * as controller from "./notice.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

// ➕ Create notice (teacher/admin)
router.post("/", auth, role("TEACHER", "ADMIN"), controller.createNotice);

// 📄 Get notices with filter
router.get("/", auth, controller.getNotices);

// 📅 Calendar events
router.get("/events", auth, controller.getEvents);

export default router;