import User from "../user/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";

// REGISTER
export const registerUser = async (data, tenantId) => {
  const existingUser = await User.findOne({
    email: data.email,
    tenantId,
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists in this tenant");
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    tenantId,
    password: hashed,
  });

  return user;
};

// LOGIN
export const loginUser = async (data, tenantId) => {
  const user = await User.findOne({
    email: data.email,
    tenantId,
  });

  if (!user) {
    throw new ApiError(404, "User not found in this tenant");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};
