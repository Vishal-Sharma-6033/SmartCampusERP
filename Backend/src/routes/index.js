import express from 'express';

const router = express.Router();

import authRoutes from '../modules/auth/auth.routes.js';


//Register routes
router.use("/auth", authRoutes)

export default router;