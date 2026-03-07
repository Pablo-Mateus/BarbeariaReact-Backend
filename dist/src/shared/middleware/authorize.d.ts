import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/index.js';
/**
 * Middleware factory that restricts access to specific roles.
 * Must be used AFTER authenticate middleware.
 *
 * Usage: authorize('owner', 'barber')
 */
export declare function authorize(...allowedRoles: UserRole[]): (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map