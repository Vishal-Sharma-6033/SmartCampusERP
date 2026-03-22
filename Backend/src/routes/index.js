import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { ROLES } from "../config/constants.js";
import userRoutes from "../modules/user/user.route.js";
import tenantRoutes from "../modules/tenants/tenant.route.js";
import academicRoutes from "../modules/academic/academic.routes.js";
const router = express.Router();

// router.get(
//   "/profile",
//   authMiddleware,
//   (req, res) => {
//     res.json({ user: req.user });
//   }
// );

router.get("/admin", authMiddleware, allowRoles(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Welcome Admin " });
});
router.get(
  "/faculty",
  authMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.TEACHER),
  (req, res) => {
    res.json({ message: "Faculty Access " });
  },
);

// ONLY FOR TEST
router.get("/test", (req, res) => {
  res.json({
    message: "Test working",
    tenant: req.tenant || null,
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tenant", tenantRoutes);
router.use("/academic", academicRoutes);

export default router;
