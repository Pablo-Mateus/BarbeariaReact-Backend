import { Response, NextFunction } from 'express';
import { ServiceService } from './service.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
    create: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    listActive: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    listAll: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    update: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=service.controller.d.ts.map