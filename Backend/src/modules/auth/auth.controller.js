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
  const { user, accessToken, refreshToken } = await AuthService.loginUser(req.body);

  // Set refresh token as HTTP-only cookie (secure from XSS)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(
    new ApiResponse(200, {
      user,
      accessToken,
      refreshToken, // Also include in response for client reference
    }, "Login successful")
  );
});