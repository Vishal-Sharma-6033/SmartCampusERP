import express from "express";
<<<<<<< HEAD
import { register, login } from "../auth/auth.controller.js";
=======
import { register, login } from "../auth/auth.contoller.js";
>>>>>>> 4cdd07dbacf2981a6e1b4c0a38503635040b7d31

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


export default router;