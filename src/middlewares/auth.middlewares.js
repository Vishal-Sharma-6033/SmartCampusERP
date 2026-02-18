import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const verifyJWT=asyncHandler(async(req,res,next)=>{

  try {
      const token = req.cookies?.accessToken ||  req.headers.authorization?.replace("Bearer ","");
  
      if (!token) {
          throw new ApiError(401, "Access token is missing");
      }
  
        const decodeTocken= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user= await User.findById(decodeTocken?.userId).select("-password -refreshToken");
  
        if(!user){
          throw new ApiError(401, "Invalid token - User not found");
        }
  
          req.user=user;
          next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token"); 
  }

}) 