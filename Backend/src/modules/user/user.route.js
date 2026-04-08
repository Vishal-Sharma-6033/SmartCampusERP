import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import allowRoles from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import {
  createUser,
  getMyProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  linkParentToStudent,
  getMyBookmarks,
} from "./user.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN), createUser);
router.get("/", authMiddleware, allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN), getAllUsers);
router.get("/me", authMiddleware, getMyProfile);
router.put("/:id", authMiddleware, allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN), updateUser);
router.delete("/:id", authMiddleware, allowRoles(ROLES.ADMIN), deleteUser);
router.post("/link-parent", authMiddleware, allowRoles(ROLES.ADMIN), linkParentToStudent);

router.get("/me/bookmarks", authMiddleware, getMyBookmarks)

export default router;