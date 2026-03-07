import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
/**
 * Extracts tenantId from authenticated user's JWT and validates it.
 * Must be used AFTER authenticate middleware.
 * Ensures every tenant-scoped request has a valid tenantId.
 */
export declare function resolveTenant(req: AuthenticatedRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=tenant-resolver.d.ts.map