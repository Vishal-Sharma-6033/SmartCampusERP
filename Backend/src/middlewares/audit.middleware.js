import { createAuditLog } from "../modules/admin/admin.service.js";

export const auditMiddleware = (action, module) => {
  return async (req, res, next) => {
    await createAuditLog({
      user: req.user?._id,
      action,
      module,
      details: req.body,
      ip: req.ip,
    });

    next();
  };
};