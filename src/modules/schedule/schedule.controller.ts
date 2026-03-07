import { Response, NextFunction } from 'express';
import { ScheduleService } from './schedule.service.js';
import { DefineScheduleInput, GetTimesInput } from './schedule.validation.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';

export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  define = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as DefineScheduleInput;
      const result = await this.scheduleService.defineSchedule(req.tenantId!, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getTimes = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body as GetTimesInput;
      const result = await this.scheduleService.getTimes(req.tenantId!, data);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
