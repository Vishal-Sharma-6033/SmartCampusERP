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
