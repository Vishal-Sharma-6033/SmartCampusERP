import express from 'express';
import controller from '../content/content.controller.js'
import auth from "../../middlewares/auth.middleware.js"
import role from "../../middlewares/role.middleware.js"
import { ROLES } from "../../config/constants.js"   
import { auditMiddleware } from "../../middlewares/audit.middleware.js";
import upload from "../../middlewares/upload.middleware.js"

const router = express.Router();


router.post("/",auth,role(ROLES.TEACHER, ROLES.ADMIN),upload.single("file"),auditMiddleware("CREATE_CONTENT", "CONTENT"),controller.createContent);

router.get("/",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.getAllContent);

router.get("/:id",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.getContentById);

router.post("/:id/view",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.addView);

router.post("/:id/download",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.addDownload);

router.delete("/:id",auth,role(ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("DELETE_CONTENT", "CONTENT"),controller.deleteContent);

router.post("/:id/bookmark",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("BOOKMARK", "CONTENT"),controller.bookmarkContent);

router.post("/:id/summarize",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("AI_SUMMARY", "CONTENT"),controller.summarizeContent);

router.post("/:id/quiz",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("AI_QUIZ", "CONTENT"),controller.generateQuizs);

router.get("/:id/stream",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.streamVideo);

router.get("/:id/download",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.secureDownload);

router.get("/:id/preview",auth,role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),controller.previewContent);

export default router;