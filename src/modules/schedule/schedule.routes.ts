import { Router } from 'express';
import { ScheduleController } from './schedule.controller.js';
import { ScheduleService } from './schedule.service.js';
import { ScheduleRepository } from './schedule.repository.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { resolveTenant } from '../../shared/middleware/tenant-resolver.js';
import { authorize } from '../../shared/middleware/authorize.js';
import { validate } from '../../shared/middleware/validate.js';
import { defineScheduleSchema, getTimesSchema } from './schedule.validation.js';

const router = Router();

// Dependency injection
const scheduleRepository = new ScheduleRepository();
const scheduleService = new ScheduleService(scheduleRepository);
const scheduleController = new ScheduleController(scheduleService);

router.use(authenticate, resolveTenant);

// Define schedule (owner only)
router.post(
  '/define',
  authorize('owner'),
  validate({ body: defineScheduleSchema }),
  scheduleController.define
);

// Get times for a day
router.post(
  '/times',
  validate({ body: getTimesSchema }),
  scheduleController.getTimes
);

export default router;
