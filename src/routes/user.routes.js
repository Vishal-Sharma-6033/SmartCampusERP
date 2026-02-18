import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();
// router.use(verifyJWT);

router.route("/register").post(
  upload.fields([
    { name: "ProfileImage", maxCount: 1 }
  ]),
  registerUser
);

export default router;
