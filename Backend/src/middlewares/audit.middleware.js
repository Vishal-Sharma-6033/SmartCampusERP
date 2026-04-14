// import { createAuditLog } from "../modules/admin/admin.service.js";

// export const auditMiddleware = (action, module) => {
//   return async (req, res, next) => {
//     await createAuditLog({
//       user: req.user?._id,
//       action,
//       module,
//       details: req.body,
//       ip: req.ip,
//     });

//     next();
//   };
// };
import { createAuditLog } from "../modules/admin/admin.service.js";

export const auditMiddleware = (action, module) => {
  return async (req, res, next) => {
    try {
      await createAuditLog({
        user: req.user?._id,
        action,
        module,
        details: {
          url: req.originalUrl,
          method: req.method,
          params: req.params,
          body: req.body,
        },
        ip: req.headers["x-forwarded-for"] || req.ip,
      });
    } catch (err) {
      console.log("Audit log error:", err.message);
    }

    next();
  };
};