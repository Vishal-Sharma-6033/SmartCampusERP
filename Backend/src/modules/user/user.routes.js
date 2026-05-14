import express from "express";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
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
import { auditMiddleware } from "../../middlewares/audit.middleware.js";

const router = express.Router();

router.post("/create",auth, role(ROLES.ADMIN),auditMiddleware("CREATE", "USER"),createUser);

router.get("/",auth, role(ROLES.ADMIN),getAllUsers);

router.get("/me",auth,getMyProfile);

router.put("/:id",auth, role(ROLES.ADMIN),auditMiddleware("UPDATE", "USER"),updateUser);

router.delete("/:id",auth, role(ROLES.ADMIN),auditMiddleware("DELETE", "USER"),deleteUser);

router.post("/link-parent",auth, role(ROLES.ADMIN),auditMiddleware("LINK_PARENT", "USER"),linkParentToStudent);

router.get("/me/bookmarks",auth, role(ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT),getMyBookmarks);


export default router;