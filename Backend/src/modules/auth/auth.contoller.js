import asyncHandlers from "../../utils/asyncHandler.js";
import * as AuthService from "./auth.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

// REGISTER
export const register = asyncHandlers(async (req, res) => {
  const user = await AuthService.registerUser(req.body);

  res.status(201).json(
    new ApiResponse(201, user, "User registered successfully")
  );
});

// LOGIN
export const login = asyncHandlers(async (req, res) => {
  const data = await AuthService.loginUser(req.body);

  res.status(200).json(
    new ApiResponse(200, data, "Login successful")
  );
});