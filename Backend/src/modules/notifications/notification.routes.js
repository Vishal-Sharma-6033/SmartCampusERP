import express from "express";
import * as controller from "./notification.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", auth, controller.getMyNotifications);

// 🔥 NEW
router.post("/", auth, controller.createNotification);



// OLD (keep)
router.patch("/:id/read", auth, controller.markAsRead);

export default router;