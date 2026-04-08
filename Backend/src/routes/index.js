import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import allowRoles from "../middlewares/role.middleware.js";
import { ROLES } from "../config/constants.js";
import userRoutes from "../modules/user/user.route.js";
import academicRoutes from "../modules/academic/academic.routes.js";
import contentRoutes from '../modules/content/content.routes.js'
import assignmentRoutes from '../modules/assignment/assignment.routes.js'
import notificationRoutes from '../modules/notifications/notification.routes.js'
import noticeRoutes from '../modules/notice/notice.routes.js'
import examRoutes from '../modules/exam/exam.routes.js'
import timetableRoutes from '../modules/timetable/timetable.routes.js'
import feeRoutes from "../modules/fees/fees.routes.js"
import libraryRoutes from "../modules/library/library.routes.js";
import searchRoutes from '../modules/search/search.routes.js';
import aiRoutes from '../modules/ai/ai.routes.js'
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

router.get("/faculty", authMiddleware, allowRoles(ROLES.ADMIN, ROLES.TEACHER),(req, res) => {
    res.json({ message: "Faculty Access " });
});

// ONLY FOR TEST
router.get("/test", (req, res) => {
  res.json({
    message: "Test working",
    tenant: req.tenant || null,
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
// router.use("/tenant", tenantRoutes);
router.use("/academic", academicRoutes);
router.use("/content", contentRoutes)
router.use("/assignments", assignmentRoutes)

router.use("/notifications", notificationRoutes);

router.use("/notices", noticeRoutes);


router.use("/exams", examRoutes);
router.use("/timetable", timetableRoutes);
router.use("/fees", feeRoutes)
router.use("/library", libraryRoutes);
router.use('/search', searchRoutes);
router.use("/ai", aiRoutes);
<<<<<<< HEAD
export default router;
=======
export default router;
>>>>>>> 4cdd07dbacf2981a6e1b4c0a38503635040b7d31
