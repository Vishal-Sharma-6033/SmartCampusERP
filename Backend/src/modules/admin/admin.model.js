import mongoose, { mongo } from "mongoose";


// Audit Log
const auditLogSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    action:String, // create, update, delete, login, logout
    module:String, // user, exam, fee,etc
    details:Object,
    ip:String
}, {timestamps:true})

// System Settings
const systemSettingSchema = new mongoose.Schema({
    key:{type:String, unique:true},
    value: mongoose.Schema.Types.Mixed
}, {timestamps:true})


export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);