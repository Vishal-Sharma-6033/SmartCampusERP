import helmet from "helmet";

/**
 * Helmet Security Configuration
 * 
 * Protects against common web vulnerabilities:
 * - X-Frame-Options: Prevents clickjacking
 * - X-Content-Type-Options: Prevents MIME-type sniffing
 * - Strict-Transport-Security: Enforces HTTPS in production
 * 
 * TODO: Enable Content Security Policy (CSP) once frontend is deployed
 * CSP currently disabled to avoid blocking frontend resources
 * Example when ready: contentSecurityPolicy: { directives: {...} }
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: false,  // Enable when frontend is ready
  crossOriginEmbedderPolicy: false,
});