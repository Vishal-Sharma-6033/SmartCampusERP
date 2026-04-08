import express from 'express';
import controller from '../content/content.controller.js'
import auth from "../../middlewares/auth.middleware.js"
import role from "../../middlewares/role.middleware.js"
import upload from "../../middlewares/upload.middleware.js"


const router = express.Router();

router.post("/", auth, role("TEACHER", "ADMIN"), upload.single("file"), controller.createContent);

router.get("/", auth, controller.getAllContent);
router.get("/:id", auth, controller.getContentById);

router.post("/:id/view", auth, controller.addView);
router.post("/:id/download", auth, controller.addDownload);

router.delete("/:id", auth, role("TEACHER"), controller.deleteContent);

router.post("/:id/bookmark", auth, controller.bookmarkContent);
router.post("/:id/summarize", controller.summarizeContent);
router.post("/:id/quiz", controller.generateQuizs);
router.get("/:id/stream", controller.streamVideo)
router.get("/:id/download", auth, controller.secureDownload)
router.get("/:id/preview", controller.previewContent)





export default router;