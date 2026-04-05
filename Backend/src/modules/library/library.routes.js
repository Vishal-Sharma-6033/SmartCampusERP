import express from "express";
import * as controller from "./library.controller.js";
import role from "../../middlewares/role.middleware.js";
import auth from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/books",auth,role("ADMIN","STUDENT","TEACHER"), controller.getBooks);
router.post("/books",auth,role("ADMIN","TEACHER"), controller.addBook);

router.post("/issue", controller.issueBook);
router.post("/return", controller.returnBook);

export default router;