import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) throw new ApiError(401, "Unauthorized");

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid token");
  }
};

export default authMiddleware;
