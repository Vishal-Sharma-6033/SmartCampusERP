import * as adminController from "./admin.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import express from "express";
import { restrictTo } from "../../middlewares/role.middleware.js";
const router = express.Router();

router.get("/logs", auth, restrictTo("ADMIN"), adminController.getLogs);
router.post("/settings", auth, restrictTo("ADMIN"), adminController.updateSetting);
router.get("/settings", auth, restrictTo("ADMIN"), adminController.getSettings);
router.patch("/user/:id/delete", auth, restrictTo("ADMIN"), adminController.deleteUser);
export default router;