import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router = Router();
router.use(verifyJWT);

router.route("/register-User").post(
  upload.fields([
    { name: "ProfileImage", maxCount: 1 }
  ]),
  registerUser
);

export default router;
