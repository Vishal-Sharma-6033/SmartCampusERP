import { AuditLog, SystemSetting } from "./admin.model.js";
import User from "../user/user.model.js";


// create audit log
export const createAuditLog = async(data)=>{
    return await AuditLog.create(data);
}

// get all logs
export const getAuditLogs = async () => {
  const logs = await AuditLog.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return logs;
};

//  SET SYSTEM SETTING
export const setSetting = async (key, value) => {
  return await SystemSetting.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true }
  );
};

//  GET SETTINGS
export const getSettings = async () => {
  return await SystemSetting.find();
};

//  SOFT DELETE USER
export const softDeleteUser = async (userId) => {
  return await User.findByIdAndUpdate(userId, { isDeleted: true }, { new: true });
};

//  RESTORE USER
export const restoreUser = async (userId) => {
  return await User.findByIdAndUpdate(userId, { isDeleted: false }, { new: true });
};