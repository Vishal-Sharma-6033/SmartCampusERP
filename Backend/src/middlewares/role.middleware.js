import ApiError from "../utils/ApiError.js";

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Required role: ${allowedRoles.join(", ")}`,
      );
    }

    next();
  };
};

export default allowRoles;