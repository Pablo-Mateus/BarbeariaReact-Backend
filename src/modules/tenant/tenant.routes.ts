import { Router } from 'express';
import { TenantController } from './tenant.controller.js';
import { TenantService } from './tenant.service.js';
import { TenantRepository } from './tenant.repository.js';
import { validate } from '../../shared/middleware/validate.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { authorize } from '../../shared/middleware/authorize.js';
import { resolveTenant } from '../../shared/middleware/tenant-resolver.js';
import { createTenantSchema, updateTenantSchema } from './tenant.validation.js';

import { UserRepository } from '../user/user.repository.js';

const router = Router();

// Dependency injection (manual)
const userRepository = new UserRepository();
const tenantRepository = new TenantRepository();
const tenantService = new TenantService(tenantRepository, userRepository);
const tenantController = new TenantController(tenantService);

// Public routes
router.get('/', tenantController.list);
router.get('/:slug', tenantController.getBySlug);
router.post('/', validate({ body: createTenantSchema }), tenantController.create);

// Protected routes (owner only)
router.put(
  '/',
  authenticate,
  resolveTenant,
  authorize('owner'),
  validate({ body: updateTenantSchema }),
  tenantController.update
);

export default router;
