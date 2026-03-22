// import Tenant from "../modules/tenants/tenant.model.js";
// import ApiError from "../utils/ApiError.js";

// const tenantMiddleware = async (req, res, next) => {
//   try {
//     if (req.path === "/tenant" && req.method === "POST") {
//       return next();
//     }

//     const tenantId = req.headers["x-tenant-id"];

//     if (!tenantId) {
//       throw new ApiError(400, "Tenant ID missing");
//     }

//     const tenant = await Tenant.findById(tenantId);

//     if (!tenant) {
//       throw new ApiError(404, "Tenant not found");
//     }

//     req.tenant = tenant;

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// export default tenantMiddleware;
import Tenant from "../modules/tenants/tenant.model.js";
import ApiError from "../utils/ApiError.js";

const tenantMiddleware = async (req, res, next) => {
  try {
    if (req.path === "/tenant" && req.method === "POST") {
      return next();
    }

    const tenantId = req.headers["x-tenant-id"];

    if (!tenantId) {
      throw new ApiError(400, "Tenant ID missing");
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      throw new ApiError(404, "Tenant not found");
    }

    req.tenant = tenant;
    req.tenantId = tenant._id; 

    next();
  } catch (error) {
    next(error);
  }
};

export default tenantMiddleware;
