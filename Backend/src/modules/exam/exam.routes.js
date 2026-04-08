import express from "express";
import * as controller from "./exam.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();
router.post("/", auth, role("TEACHER","ADMIN"), controller.createExam);
router.get("/", auth, controller.getExams);

router.post("/register", auth, role("STUDENT"), controller.register);

router.get("/results", auth, controller.results);

router.get("/hallticket", auth, controller.hallTicket);

// 🔥 Admin only
router.post("/publish", auth, role("ADMIN", "TEACHER"), controller.publishResult);

router.get("/hallticket/download", auth, controller.downloadHallTicket);

// ADMIN
router.post(
  "/seating/generate",
  auth,
  role("ADMIN"),
  controller.generateSeating
);
export default router;