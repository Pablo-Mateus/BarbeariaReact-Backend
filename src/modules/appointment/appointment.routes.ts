import { Router } from 'express';
console.log('--- Appointment Routes Loaded ---');
import { AppointmentController } from './appointment.controller.js';
import { AppointmentService } from './appointment.service.js';
import { AppointmentRepository } from './appointment.repository.js';
import { ScheduleRepository } from '../schedule/schedule.repository.js';
import { authenticate } from '../../shared/middleware/authenticate.js';
import { resolveTenant } from '../../shared/middleware/tenant-resolver.js';
import { authorize } from '../../shared/middleware/authorize.js';
import { validate } from '../../shared/middleware/validate.js';
import {
  createAppointmentSchema,
  cancelAppointmentSchema,
  confirmAppointmentSchema,
  dayAvailabilitySchema,
} from './appointment.validation.js';

const router = Router();

// Dependency injection
const appointmentRepository = new AppointmentRepository();
const scheduleRepository = new ScheduleRepository();
const appointmentService = new AppointmentService(appointmentRepository, scheduleRepository);
const appointmentController = new AppointmentController(appointmentService);

// All appointment routes require authentication + tenant
router.use(authenticate, resolveTenant);

router.post(
  '/',
  validate({ body: createAppointmentSchema }),
  appointmentController.create
);

router.get('/', appointmentController.list);

router.post(
  '/cancel',
  validate({ body: cancelAppointmentSchema }),
  appointmentController.cancel
);

router.post(
  '/confirm',
  authorize('owner', 'barber'),
  validate({ body: confirmAppointmentSchema }),
  appointmentController.confirm
);

router.post('/archive', appointmentController.archive);
router.post('/archive-canceled', appointmentController.archive);

router.delete(
  '/cancelled',
  authorize('owner'),
  appointmentController.deleteCancelled
);

// Availability route (moved up for visibility/testing)
router.post(
  '/availability',
  validate({ body: dayAvailabilitySchema }),
  appointmentController.dayAvailability
);

export default router;
