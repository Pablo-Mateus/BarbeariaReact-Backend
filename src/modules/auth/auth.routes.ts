import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserRepository } from '../user/user.repository.js';
import { TenantRepository } from '../tenant/tenant.repository.js';
import { validate } from '../../shared/middleware/validate.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { authRateLimiter } from '../../shared/middleware/rate-limiter.js';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
  confirmEmailSchema,
} from './auth.validation.js';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const tenantRepository = new TenantRepository();
const authService = new AuthService(userRepository, tenantRepository);
const authController = new AuthController(authService);

// Public routes with rate limiting
router.post(
  '/register',
  authRateLimiter,
  validate({ body: registerSchema }),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate({ body: loginSchema }),
  authController.login
);

router.get(
  '/confirm-email',
  validate({ query: confirmEmailSchema }),
  authController.confirmEmail
);

router.post(
  '/reset-password',
  authRateLimiter,
  validate({ body: resetPasswordSchema }),
  authController.resetPassword
);

router.post(
  '/change-password',
  authRateLimiter,
  validate({ body: changePasswordSchema }),
  authController.changePassword
);

// Protected route
router.get('/check-auth', authenticate, authController.checkAuth);

export default router;
