import { Response, NextFunction } from 'express';
import { AppointmentService } from './appointment.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    cancel: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    confirm: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    archive: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteCancelled: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    list: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    dayAvailability: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=appointment.controller.d.ts.map