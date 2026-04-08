import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

// GENERATE ACCESS TOKEN
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      tenantId: user.tenantId,
    },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRE },
  );
};

// GENERATE REFRESH TOKEN
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: ENV.REFRESH_EXPIRE },
  );
};
<<<<<<< HEAD
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
=======
// console.log("JWT_SECRET:", process.env.JWT_SECRET);
>>>>>>> 4cdd07dbacf2981a6e1b4c0a38503635040b7d31
