import { Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    listClients: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    listBarbers: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    update: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map