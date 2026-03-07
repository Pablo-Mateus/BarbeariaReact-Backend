import { Router } from 'express';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { resolveTenant } from '../../shared/middleware/tenant-resolver.js';
import { authorize } from '../../shared/middleware/authorize.js';
import { validate } from '../../shared/middleware/validate.js';
import { updateUserSchema } from './user.validation.js';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.use(authenticate, resolveTenant);

// Owner can list clients and barbers
router.get('/clients', authorize('owner', 'barber'), userController.listClients);
router.get('/barbers', authorize('owner'), userController.listBarbers);

// Owner can update user roles
router.put(
  '/:id',
  authorize('owner'),
  validate({ body: updateUserSchema }),
  userController.update
);

export default router;
