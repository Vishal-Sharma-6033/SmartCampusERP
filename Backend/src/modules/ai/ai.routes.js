import express from "express";
import {chatWithAI} from "./ai.controller.js";

import auth from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/chat", auth, chatWithAI);


export default router;