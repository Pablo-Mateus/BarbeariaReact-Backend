import { Response, NextFunction } from 'express';
import { AppointmentService } from './appointment.service.js';
import { CreateAppointmentInput, DayAvailabilityInput } from './appointment.validation.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';

export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as CreateAppointmentInput;
      const result = await this.appointmentService.createAppointment(
        req.tenantId!,
        req.user!,
        data
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agendamentoId } = req.body as { agendamentoId: string };
      const result = await this.appointmentService.cancelAppointment(req.tenantId!, agendamentoId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  confirm = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { agendamentoId } = req.body as { agendamentoId: string };
      const result = await this.appointmentService.confirmAppointment(req.tenantId!, agendamentoId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  archive = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.appointmentService.archiveCancelled(
        req.tenantId!,
        req.user!.name
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteCancelled = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.appointmentService.deleteCancelled(req.tenantId!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.appointmentService.getSchedules(req.tenantId!, req.user!);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  dayAvailability = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as DayAvailabilityInput;
      const result = await this.appointmentService.getDayAvailability(req.tenantId!, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
