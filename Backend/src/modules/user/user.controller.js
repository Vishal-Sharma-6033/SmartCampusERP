import * as UserService from "./user.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

// ✅ CREATE USER (Admin use)
export const createUser = asyncHandler(async (req, res) => {
  const user = await UserService.createUser(req.body);

  res.status(201).json(
    new ApiResponse(201, user, "User created successfully")
  );
});

// ✅ GET MY PROFILE
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user.id);

  res.status(200).json(
    new ApiResponse(200, user, "Profile fetched successfully")
  );
});

// ✅ UPDATE USER
export const updateUser = asyncHandler(async (req, res) => {
  const user = await UserService.updateUser(
    req.params.id,
    req.body
  );

  res.status(200).json(
    new ApiResponse(200, user, "User updated successfully")
  );
});

// ✅ DELETE USER (Soft delete)
export const deleteUser = asyncHandler(async (req, res) => {
  await UserService.deleteUser(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );
});

// ✅ GET ALL USERS (with search + pagination)
export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  res.status(200).json(
    new ApiResponse(200, result, "Users fetched successfully")
  );
});

// ✅ LINK PARENT TO STUDENT
export const linkParentToStudent = asyncHandler(async (req, res) => {
  const { parentId, studentId } = req.body;

  const result = await UserService.linkParentToStudent(
    parentId,
    studentId
  );

  res.status(200).json(
    new ApiResponse(200, result, "Parent linked to student")
  );
});