
// // // export default tenantMiddleware;
// // const tenantMiddleware = async (req, res, next) => {
// //   try {
// //     // ✅ Skip for public routes
// //     if (
// //       req.path.includes("/auth/login") ||
// //       req.path.includes("/auth/register") ||
// //       (req.path === "/tenant" && req.method === "POST")
// //     ) {
// //       return next();
// //     }

// //     const tenantId = req.headers["x-tenant-id"];

// //     if (!tenantId) {
// //       throw new ApiError(400, "Tenant ID missing");
// //     }

// //     const tenant = await Tenant.findById(tenantId);

// //     if (!tenant) {
// //       throw new ApiError(404, "Tenant not found");
// //     }

// //     req.tenant = tenant;
// //     req.tenantId = tenant._id;

// //     next();
// //   } catch (error) {
// //     next(error);
// //   }
// // };
// import mongoose from "mongoose";
// import Tenant from "../modules/tenants/tenant.model.js";
// import ApiError from "../utils/ApiError.js";

// const tenantMiddleware = async (req, res, next) => {
//   try {
//     // 🟢 1. Skip public routes (Auth + Create Tenant)
//     if (
//       req.path.startsWith("/auth") ||
//       (req.path === "/tenant" && req.method === "POST")
//     ) {
//       return next();
//     }

//     // 🟡 2. Get tenantId from headers
//     const tenantId = req.headers["x-tenant-id"];

//     if (!tenantId) {
//       throw new ApiError(400, "Tenant ID missing in headers");
//     }

//     // 🔴 3. Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(tenantId)) {
//       throw new ApiError(400, "Invalid Tenant ID");
//     }

//     // 🔵 4. Find tenant
//     const tenant = await Tenant.findById(tenantId);

//     if (!tenant) {
//       throw new ApiError(404, "Tenant not found");
//     }

//     // 🟣 5. Attach to request
//     req.tenant = tenant;
//     req.tenantId = tenant._id;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// export default tenantMiddleware;