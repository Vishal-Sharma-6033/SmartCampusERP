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
} from "./user.controller.js";

const router = express.Router();

// ✅ CREATE USER (ADMIN / SUPER_ADMIN)
router.post(
  "/create",
  authMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  createUser
);

// ✅ GET ALL USERS
router.get(
  "/",
  authMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  getAllUsers
);

// ✅ GET MY PROFILE
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

// ✅ UPDATE USER
router.put(
  "/:id",
  authMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  updateUser
);

// ✅ DELETE USER
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(ROLES.ADMIN),
  deleteUser
);

// ✅ LINK PARENT TO STUDENT
router.post(
  "/link-parent",
  authMiddleware,
  allowRoles(ROLES.ADMIN),
  linkParentToStudent
);

export default router;