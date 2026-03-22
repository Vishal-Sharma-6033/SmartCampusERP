import User from "./user.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/ApiError.js";
import { ROLES } from "../../config/constants.js";

// CREATE USER
export const createUser = async (data, tenantId) => {
  //  Tenant-based check
  const existingUser = await User.findOne({
    email: data.email,
    tenantId,
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists in this tenant");
  }
  if (data.role === ROLES.SUPER_ADMIN) {
    throw new ApiError(403, "Cannot assign SUPER_ADMIN role");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  if (!data.role) {
    data.role = ROLES.STUDENT;
  }
  const user = await User.create({
    ...data,
    tenantId,
    password: hashedPassword,
  });

  return user;
};

// GET USER BY  ID
export const getUserById = async (id, tenantId) => {
  const user = await User.findOne({
    _id: id,
    tenantId,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

// UPDATE USER
export const updateUser = async (userId, data, tenantId) => {
  const user = await User.findOne({
    _id: userId,
    tenantId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ❌ Prevent SUPER_ADMIN change
  if (user.role === "SUPER_ADMIN") {
    throw new ApiError(403, "Cannot modify SUPER_ADMIN");
  }

  // 🔐 Prevent invalid role
  if (data.role && !Object.values(ROLES).includes(data.role)) {
    throw new ApiError(400, "Invalid role");
  }

  Object.assign(user, data);

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

// DELETE USER
export const deleteUser = async (userId, tenantId) => {
  const user = await User.findOne({
    _id: userId,
    tenantId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isActive = false;
  await user.save();

  return true;
};

// GET ALL USERS
export const getAllUsers = async (tenantId, query) => {
  const { page = 1, limit = 10, search = "", role } = query;

  const filter = {
    tenantId,
    isActive: true,
  };

  // 🔍 Search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // 🎯 Role filter
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

// LINK PARENT TO STUDENT
export const linkParentToStudent = async (parentId, studentId, tenantId) => {
  const parent = await User.findOne({ _id: parentId, tenantId });
  const student = await User.findOne({ _id: studentId, tenantId });

  if (!parent || !student) {
    throw new ApiError(404, "User not found");
  }

  // ✅ Role check
  if (parent.role !== "PARENT") {
    throw new ApiError(400, "User is not a parent");
  }

  if (student.role !== "STUDENT") {
    throw new ApiError(400, "User is not a student");
  }

  // 🔥 Prevent duplicate
  if (parent.parentProfile.children.includes(studentId)) {
    throw new ApiError(400, "Already linked");
  }

  parent.parentProfile.children.push(studentId);

  await parent.save();

  return parent;
};
