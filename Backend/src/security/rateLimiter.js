import rateLimit from "express-rate-limit";

// Global limiter
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

//  Auth limiter (login/register)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: "Too many login attempts, try later",
});
