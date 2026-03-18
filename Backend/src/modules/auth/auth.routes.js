import express from "express";

const router = express.Router();



// TEMP test route
router.post("/login", (req, res) => {
  res.json(new ApiResponse(200, null, "Login API working"));
});



router.post("/register", (req, res) => {
  res.json(new ApiResponse(200, null, "Register API working"));
});

export default router;