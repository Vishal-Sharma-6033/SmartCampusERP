import mongoSanitize from "express-mongo-sanitize";

export const sanitizeMiddleware = mongoSanitize({
  replaceWith: "_",
});