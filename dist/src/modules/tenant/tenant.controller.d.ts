import { Request, Response, NextFunction } from 'express';
import { TenantService } from './tenant.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    list: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=tenant.controller.d.ts.map