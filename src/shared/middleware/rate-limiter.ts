import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication routes (login, register, reset password).
 * Limits to 10 requests per 15 minutes per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: 'Muitas tentativas. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter.
 * Limits to 100 requests per 15 minutes per IP.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Limite de requisições excedido. Tente novamente em breve.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
