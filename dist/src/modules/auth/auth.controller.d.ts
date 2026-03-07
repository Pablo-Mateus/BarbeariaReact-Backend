import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest } from '../../shared/types/index.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    confirmEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    checkAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map