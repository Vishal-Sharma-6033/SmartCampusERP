import User from "./user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../config/constants.js";

// ✅ CREATE USER
export const createUser = async (data) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // ❌ Prevent SUPER_ADMIN creation
  if (data.role === ROLES.SUPER_ADMIN) {
    throw new ApiError(403, "Cannot assign SUPER_ADMIN role");
  }

  // 🔐 hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 🎯 default role
  if (!data.role) {
    data.role = ROLES.STUDENT;
  }

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

// ✅ GET USER BY ID
export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// ✅ UPDATE USER
export const updateUser = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ❌ prevent SUPER_ADMIN modification
  if (user.role === ROLES.SUPER_ADMIN) {
    throw new ApiError(403, "Cannot modify SUPER_ADMIN");
  }

  // 🔐 validate role
  if (data.role && !Object.values(ROLES).includes(data.role)) {
    throw new ApiError(400, "Invalid role");
  }

  Object.assign(user, data);
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

// ✅ DELETE USER (soft delete)
export const deleteUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isActive = false;
  await user.save();

  return true;
};

// ✅ GET ALL USERS (pagination + search + filter)
export const getAllUsers = async (query) => {
  const { page = 1, limit = 10, search = "", role } = query;

  const filter = {
    isActive: true,
  };

  // 🔍 search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // 🎯 role filter
  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    users,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

// ✅ LINK PARENT TO STUDENT
export const linkParentToStudent = async (parentId, studentId) => {
  const parent = await User.findById(parentId);
  const student = await User.findById(studentId);

  if (!parent || !student) {
    throw new ApiError(404, "User not found");
  }

  // ✅ role validation
  if (parent.role !== ROLES.PARENT) {
    throw new ApiError(400, "User is not a parent");
  }

  if (student.role !== ROLES.STUDENT) {
    throw new ApiError(400, "User is not a student");
  }

  // 🔥 prevent duplicate
  if (parent.parentProfile.children.includes(studentId)) {
    throw new ApiError(400, "Already linked");
  }

  parent.parentProfile.children.push(studentId);
  await parent.save();

  return parent;
};