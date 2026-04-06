import express from "express";
import * as controller from "./notification.controller.js";
import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", auth, controller.getMyNotifications);
router.post("/", auth, controller.createNotification);
router.patch("/:id/read", auth, controller.markAsRead);

export default router;