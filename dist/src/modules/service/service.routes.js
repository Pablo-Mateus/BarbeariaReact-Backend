import { Router } from 'express';
import { ServiceController } from './service.controller.js';
import { ServiceService } from './service.service.js';
import { ServiceRepository } from './service.repository.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { resolveTenant } from '../../shared/middleware/tenant-resolver.js';
import { authorize } from '../../shared/middleware/authorize.js';
import { validate } from '../../shared/middleware/validate.js';
import { createServiceSchema, updateServiceSchema } from './service.validation.js';
const router = Router();
// Dependency injection
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);
router.use(authenticate, resolveTenant);
// All authenticated users can list active services
router.get('/', serviceController.listActive);
// Owner can manage services
router.get('/all', authorize('owner'), serviceController.listAll);
router.post('/', authorize('owner'), validate({ body: createServiceSchema }), serviceController.create);
router.put('/:id', authorize('owner'), validate({ body: updateServiceSchema }), serviceController.update);
router.delete('/:id', authorize('owner'), serviceController.delete);
export default router;
//# sourceMappingURL=service.routes.js.map