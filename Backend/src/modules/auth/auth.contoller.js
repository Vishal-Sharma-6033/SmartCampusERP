import * as AuthService from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";


// REGISTER
export const register = asyncHandler(async (req, res) => {
  const user = await AuthService.registerUser(
    req.body,
    req.tenant._id 
  );

  res.status(201).json(
    new ApiResponse(201, user, "User registered successfully")
  );
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const data = await AuthService.loginUser(
    req.body,
    req.tenant._id 
  );

  res.status(200).json(
    new ApiResponse(200, data, "Login successful")
  );
});