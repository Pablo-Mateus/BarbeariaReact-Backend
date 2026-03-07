/**
 * Rate limiter for authentication routes (login, register, reset password).
 * Limits to 10 requests per 15 minutes per IP.
 */
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * General API rate limiter.
 * Limits to 100 requests per 15 minutes per IP.
 */
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rate-limiter.d.ts.map