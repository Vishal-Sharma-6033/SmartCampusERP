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
    }, "Login successful")
  );
});

// REFRESH ACCESS TOKEN
// Reads the refresh token from the httpOnly cookie set during login.
// Issues a new access token and rotates the refresh token cookie.
export const refresh = asyncHandlers(async (req, res) => {
  const token = req.cookies?.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await AuthService.refreshAccessToken(token);

  // Rotate the refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json(
    new ApiResponse(200, { accessToken }, "Token refreshed successfully")
  );
});

// LOGOUT — clears the refresh token cookie
export const logout = asyncHandlers(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json(
    new ApiResponse(200, null, "Logged out successfully")
  );
});