import express from "express";
import { createUser } from "./user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import allowRoles from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import { getMyProfile } from "./user.controller.js";
import { getAllUsers } from "./user.controller.js"; 
import roleMiddleware from "../../middlewares/role.middleware.js";
import { updateUser, deleteUser, linkParentToStudent } from "./user.controller.js";
const router = express.Router();

//  Only ADMIN can create users
router.post(
  "/create",
  authMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  createUser
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  getAllUsers
);
router.get("/me", authMiddleware, getMyProfile);


router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "SUPER_ADMIN"),
  updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteUser
);
router.post(
  "/link-parent",
  authMiddleware,
  roleMiddleware("ADMIN"),
  linkParentToStudent
);


export default router;