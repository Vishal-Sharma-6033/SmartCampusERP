import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";
import { ENV } from "../../config/env.js";

const toSafeUser = (user) => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// REGISTER
export const registerUser = async (data) => {
  const existingUser = await User.findOne({
    email: data.email.toLowerCase(),
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role || "STUDENT",
  });

  return toSafeUser(user);
};

//  LOGIN
export const loginUser = async (data) => {
  const user = await User.findOne({
    email: data.email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    user: toSafeUser(user),
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

// REFRESH ACCESS TOKEN
export const refreshAccessToken = async (token) => {
  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token has expired, please login again");
    }
    throw new ApiError(401, "Invalid refresh token");
  }

  // Confirm the user still exists and is active
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }
  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated");
  }

  // Issue a new access token + rotate the refresh token
  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};