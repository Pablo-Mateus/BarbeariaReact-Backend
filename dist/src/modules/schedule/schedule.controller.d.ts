import { Response, NextFunction } from 'express';
import { ScheduleService } from './schedule.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
export declare class ScheduleController {
    private readonly scheduleService;
    constructor(scheduleService: ScheduleService);
    define: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getTimes: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=schedule.controller.d.ts.map