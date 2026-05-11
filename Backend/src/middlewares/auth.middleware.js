import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token has expired");
    }
    
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }
    
    throw new ApiError(401, "Authentication failed");
  }
};


export default authMiddleware;


