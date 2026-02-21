import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();
router.use(verifyJWT);

router.route("/register").post(
  upload.fields([
    { name: "ProfileImage", maxCount: 1 }
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);



export default router;
